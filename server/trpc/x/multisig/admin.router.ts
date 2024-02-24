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
          input.members.map(async (m) => {
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

      return {
        balance: 0,
        ...wallet
      }
    }),
})