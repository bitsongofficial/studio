import { z } from 'zod'
import { adminProcedure, router } from '../../trpc'
import { isValidAddress } from '@bitsongjs/metadata'
import { nanoid } from 'nanoid'
import { TRPCError } from '@trpc/server'
import { fromBech32 } from "@cosmjs/encoding";
import {
  MultisigThresholdPubkey,
  createMultisigThresholdPubkey,
  pubkeyToAddress,
  SinglePubkey,
} from "@cosmjs/amino";

export const multisigAdminRouter = router({
  listWallets: adminProcedure
    .query(async ({ ctx, input }) => {
      return await ctx.database.multisig_wallets.findMany({
        where: {
          members: {
            some: {
              address: ctx.user.address
            }
          }
        }
      })
    }),
  createWallet: adminProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        description: z.string().max(100).optional(),
        members: z.array(
          z.object({
            index: z.number().int(),
            address: z.string().refine((v) => isValidAddress(v, 'bitsong')),
            name: z.string().max(100).optional()
          })
        ).min(2),
        threshold: z.number().int().min(1)
      }).superRefine((v) => {
        const addresses = v.members.map((m) => m.address)
        if (addresses.length !== new Set(addresses).size) {
          return {
            message: 'Members must be unique'
          }
        }

        if (v.threshold > v.members.length) {
          return {
            message: 'Threshold must be less than or equal to the number of members'
          }
        }
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { restAddress } = useRuntimeConfig().public

      const pubKeys = (
        await Promise.all(
          input.members
            .sort((a, b) => a.index - b.index)
            .map(async (m) => {
              const data = await $fetch<{ account: { pub_key: { '@type': string, key: string } } }>(`${restAddress}/cosmos/auth/v1beta1/accounts/${m.address}`)
              if (!data) {
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'Account not found' })
              }

              if (data.account.pub_key['@type'] !== '/cosmos.crypto.secp256k1.PubKey') {
                throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid public key type' })
              }

              return {
                type: 'tendermint/PubKeySecp256k1',
                value: data.account.pub_key.key
              } as SinglePubkey
            })
        )
      ) as SinglePubkey[]

      try {
        const multisigPubKey = createMultisigThresholdPubkey(
          pubKeys,
          input.threshold
        )

        const multisigAddress = pubkeyToAddress(multisigPubKey, 'bitsong')

        await ctx.database.multisig_wallets.create({
          data: {
            id: multisigAddress,
            name: input.name,
            description: input.description,
            threshold: input.threshold,
            pubkey: JSON.stringify(multisigPubKey),
            members: {
              createMany: {
                data: input.members.map((m, index) => ({
                  index,
                  address: m.address,
                  name: m.name,
                  id: nanoid(12)
                }))
              }
            }
          }
        })

        return {
          address: multisigAddress
        }
      } catch (e) {
        console.error(e)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create wallet' })
      }
    }),
  getWallet: adminProcedure
    .input(z.object({
      address: z.string()
    }))
    .query(async ({ ctx, input }) => {
      const wallet = await ctx.database.multisig_wallets.findFirst({
        where: {
          id: input.address,
          members: {
            some: {
              address: ctx.user.address
            }
          }
        },
        include: {
          members: true,
          txs: true
        },
        orderBy: {
          created_at: 'desc'
        }
      })

      if (!wallet) {
        throw new Error('Wallet not found')
      }

      const { restAddress } = useRuntimeConfig().public
      const auth = await $fetch<{ account: { account_number: string, sequence: string } }>(`${restAddress}/cosmos/auth/v1beta1/accounts/${input.address}`, {
        ignoreResponseError: true
      })
      const bank = await $fetch<{ balances: { denom: string, amount: string }[] }>(`${restAddress}/cosmos/bank/v1beta1/balances/${input.address}`, {
        ignoreResponseError: true
      })

      return {
        account_number: auth?.account?.account_number || '0',
        sequence: auth?.account?.sequence || '0',
        balance: bank?.balances.find((b) => b.denom === 'ubtsg')?.amount || '0',
        ...wallet
      }
    }),
  createTx: adminProcedure
    .input(z.object({
      wallet: z.string().refine((v) => isValidAddress(v, 'bitsong')),
      title: z.string().min(1).max(100),
      description: z.string().max(100).optional(),
      memo: z.string().max(256).optional(),
      msgs: z.array(z.any()).min(1),
      fee: z.object({
        amount: z.array(
          z.object({
            denom: z.string(),
            amount: z.string()
          })
        ),
        gas: z.string()
      })
    }))
    .mutation(async ({ ctx, input }) => {
      const wallet = await ctx.database.multisig_wallets.findFirst({
        where: {
          id: input.wallet,
          members: {
            some: {
              address: ctx.user.address
            }
          }
        },
      })

      if (!wallet) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Wallet not found' })
      }

      try {
        const { restAddress } = useRuntimeConfig().public
        const auth = await $fetch<{ account: { account_number: string, sequence: string } }>(`${restAddress}/cosmos/auth/v1beta1/accounts/${wallet.id}`, {
          ignoreResponseError: true
        })

        const dbData = await ctx.database.multisig_wallet_txs.findFirst({
          where: {
            wallet_id: wallet.id,
          },
          select: {
            sequence: true
          },
          orderBy: {
            sequence: 'desc'
          }
        })

        let sequence;

        if (parseInt(auth.account.sequence) >= (dbData?.sequence ?? 0)) {
          sequence = parseInt(auth.account.sequence)
        } else {
          sequence = dbData?.sequence ?? 0
        }

        const tx = await ctx.database.multisig_wallet_txs.create({
          data: {
            id: nanoid(12),
            title: input.title,
            description: input.description,
            msgs: JSON.stringify(input.msgs),
            fee: JSON.stringify(input.fee),
            memo: input.memo ?? "",
            sequence,
            status: 'Pending_Signatures',
            wallet: {
              connect: {
                id: wallet.id
              }
            }
          }
        })

        return {
          id: tx.id
        }
      } catch (e) {
        console.error(e)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create transaction' })
      }
    }),
  getTx: adminProcedure
    .input(z.object({
      wallet: z.string().refine((v) => isValidAddress(v, 'bitsong')),
      id: z.string()
    }))
    .query(async ({ ctx, input }) => {
      const tx = await ctx.database.multisig_wallet_txs.findFirst({
        where: {
          id: input.id,
          wallet_id: input.wallet
        },
        include: {
          wallet: {
            include: {
              members: true
            }
          },
          signatures: true
        }
      })

      if (!tx) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Transaction not found' })
      }

      const { restAddress } = useRuntimeConfig().public
      const auth = await $fetch<{ account: { account_number: string, sequence: string } }>(`${restAddress}/cosmos/auth/v1beta1/accounts/${tx.wallet?.id}`, {
        ignoreResponseError: true
      })

      return {
        account_number: auth?.account?.account_number || '0',
        sequenceReal: auth?.account?.sequence || '0',
        ...tx
      }
    }),
})