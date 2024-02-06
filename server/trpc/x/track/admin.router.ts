import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { adminProcedure, router } from '../../trpc'
import { withPrivateSignedUrls } from '~/server/api/me/tracks/index.get'

export const trackAdminRouter = router({
  tracks: adminProcedure
    .input(
      z.object({
        createdAtFrom: z.coerce.date().nullish(),
        createdAtTo: z.coerce.date().nullish(),
      }).nullish()
    )
    .query(async ({ ctx }) => {
      const tracks = await ctx.database.tracks.findMany({
        select: {
          id: true,
          title: true,
          artwork: true,
          artists: true,
          status: true,
        },
        take: 10,
        orderBy: {
          created_at: 'desc'
        }
      })

      return await withPrivateSignedUrls(tracks, 'http://localhost:3000')
    })
})