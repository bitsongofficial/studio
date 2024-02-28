import { z } from 'zod'
import { protectedProcedure, router } from '../../trpc'
import { isValidAddress } from '@bitsongjs/metadata'
import { TRPCError } from '@trpc/server'
import { contracts } from "@bitsongjs/telescope";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";

export const multisigAdminRouter = router({
  listWallets: protectedProcedure
    .input(
      z.object({
        address: z.string().refine((v) => isValidAddress(v, 'bitsong'))
      })
    )
    .query(async ({ ctx, input }) => {
      // TODO: this should be handled by an indexer
      // this is only a temporary solution

      const { rpcAddress } = useRuntimeConfig().public;
      const cwClient = await CosmWasmClient.connect(rpcAddress)

      const cw3_code_id = 6
      const contractAddresses = await cwClient.getContracts(cw3_code_id)

      const { Cw3FixedMultisigQueryClient } = contracts.Cw3FixedMultisig

      return await Promise.all(
        contractAddresses.map(async (address) => {
          const client = new Cw3FixedMultisigQueryClient(cwClient, address)

          const { voters } = await client.listVoters({ limit: 100 })
          const found = voters.find((v) => v.addr === input.address)
          if (!found) return

          return {
            address,
            voters: voters.length
          }
        })
      )
    }),
  getWallet: protectedProcedure
    .input(z.object({
      address: z.string()
    }))
    .query(async ({ ctx, input }) => {
      try {
        const { rpcAddress } = useRuntimeConfig().public;
        const cwClient = await CosmWasmClient.connect(rpcAddress)

        const { Cw3FixedMultisigQueryClient } = contracts.Cw3FixedMultisig
        const client = new Cw3FixedMultisigQueryClient(cwClient, input.address)

        const { proposals } = await client.listProposals({ limit: 100 })
        const { voters } = await client.listVoters({ limit: 100 })
        const balance = await cwClient.getBalance(input.address, 'ubtsg')

        return {
          balance,
          proposals,
          voters
        }
      } catch (e) {
        console.error(e)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to get wallet' })
      }
    }),
  getTx: protectedProcedure
    .input(z.object({
      //wallet: z.string().refine((v) => isValidAddress(v, 'bitsong')),
      wallet: z.string(), // TODO: validate smart contract address
      id: z.string()
    }))
    .query(async ({ ctx, input }) => {
      const { rpcAddress } = useRuntimeConfig().public;
      const cwClient = await CosmWasmClient.connect(rpcAddress)

      const { Cw3FixedMultisigQueryClient } = contracts.Cw3FixedMultisig
      const client = new Cw3FixedMultisigQueryClient(cwClient, input.wallet)

      const proposal = await client.proposal({ proposalId: parseInt(input.id) })
      const { votes } = await client.listVotes({ proposalId: parseInt(input.id) })
      const { voters } = await client.listVoters({ limit: 100 })

      // @ts-expect-error
      const quorum = ((proposal.threshold.absolute_count.weight / proposal.threshold.absolute_count.total_weight) * 100).toFixed(2)
      const current_consensus = (votes.reduce((acc, vote) => {
        return acc + vote.weight
        // @ts-expect-error
      }, 0) / proposal.threshold.absolute_count.total_weight * 100).toFixed(2)

      return {
        ...proposal,
        quorum,
        current_consensus,
        votes: voters.map((v) => {
          const vote = votes.find((vote) => vote.voter === v.addr)
          return {
            voter: v.addr,
            weight: v.weight,
            vote: vote?.vote || '-'
          }
        })
      }
    }),
})