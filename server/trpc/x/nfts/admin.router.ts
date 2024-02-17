import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { adminProcedure, router } from '../../trpc'
import { TrackMetadata, TrackSchema } from '@bitsongjs/metadata'
import { useIpfsLink } from '~/composables/useIpfsLink'

export const nftsAdminRouter = router({
  list: adminProcedure
    .input(
      z.object({
        //createdAtFrom: z.coerce.date().nullish(),
        //createdAtTo: z.coerce.date().nullish(),
        limit: z.number().min(1).max(100).int().positive().default(10),
        page: z.number().int().max(100).positive().default(0),
        orderBy: z.enum(['Newest', 'Oldest']).nullish().default('Newest'),
      }).nullish()
    )
    .query(async ({ ctx, input }) => {
      const take = input?.limit || 10
      const skip = input?.page && input.page > 0 ? (input.page - 1) * take : 0

      const nfts = await ctx.database.nftview.findMany({
        select: {
          id: true,
          image: true,
          name: true,
          symbol: true,
          start_time: true,
          timestamp: true,
          sender: true,
          user: {
            select: {
              id: true,
              username: true,
              address: true,
              avatar: true
            }
          }
        },
        take, skip,
        orderBy: {
          timestamp: input?.orderBy === 'Newest' ? 'desc' : 'asc'
        },
      })

      if (!nfts) throw new TRPCError({ code: 'NOT_FOUND', message: 'No nfts found' })

      return nfts
    }),
  count: adminProcedure
    .query(async ({ ctx }) => {
      // TODO: handle filtering

      const result = await ctx.database.$queryRaw<{ total: string }[]>`
        SELECT
          COUNT(*) AS total
        FROM
          public.nftview n;
    `;

      return {
        total: parseInt(result[0].total)
      }
    }),
  get: adminProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const nft = await ctx.database.nftview.findUnique({
        include: {
          user: true
        },
        where: {
          id: input.id
        }
      })

      if (!nft) throw new TRPCError({ code: 'NOT_FOUND', message: 'NFT not found' })

      return nft
    }),
  metadata: adminProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(async ({ ctx, input }) => {
      const nft = await ctx.database.nftview.findUnique({
        include: {
          user: true
        },
        where: {
          id: input.id
        }
      })

      if (!nft) throw new TRPCError({ code: 'NOT_FOUND', message: 'NFT not found' })

      if (!nft.uri || !nft.uri.startsWith('ipfs://')) throw new TRPCError({ code: 'NOT_FOUND', message: 'NFT metadata not found' })

      const rawMetadata = await $fetch(useIpfsLink(nft.uri))
      if (!rawMetadata) throw new TRPCError({ code: 'NOT_FOUND', message: 'NFT metadata not found' })

      const metadata = TrackSchema.safeParse(rawMetadata)
      if (!metadata.success) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Invalid NFT metadata' })

      return metadata.data
    }),
})