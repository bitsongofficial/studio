import { TRPCError } from '@trpc/server'
import { string, z } from 'zod'
import { adminProcedure, router } from '../../trpc'
import { DeleteObjectCommand } from '@aws-sdk/client-s3'

export const tracksAdminRouter = router({
  list: adminProcedure
    .input(
      z.object({
        //createdAtFrom: z.coerce.date().nullish(),
        //createdAtTo: z.coerce.date().nullish(),
        limit: z.number().min(1).max(100).int().positive().default(10),
        page: z.number().int().max(100).positive().default(0),
        status: z.enum(['Minted', 'To_Mint', 'Draft']).nullish().default('Minted'),
        orderBy: z.enum(['Newest', 'Oldest']).nullish().default('Newest'),
      }).nullish()
    )
    .query(async ({ ctx, input }) => {
      const take = input?.limit || 10
      const skip = input?.page && input.page > 0 ? (input.page - 1) * take : 0

      const tracks = await ctx.database.tracks.findMany({
        select: {
          id: true,
          title: true,
          artists: true,
          status: true,
          genre: true,
          duration: true,
          user: {
            select: {
              id: true,
              username: true,
              address: true,
              avatar: true
            }
          },
          created_at: true,
          updated_at: true
        },
        where: {
          AND: [
            input?.status ? { status: input.status } : {}
          ]
        },
        take, skip,
        orderBy: {
          created_at: input?.orderBy === 'Newest' ? 'desc' : 'asc'
        },
      })

      if (!tracks) throw new TRPCError({ code: 'NOT_FOUND', message: 'No tracks found' })

      return tracks
    }),
  count: adminProcedure
    .query(async ({ ctx }) => {
      // TODO: handle filtering

      const result = await ctx.database.$queryRaw<{ minted: string, to_mint: string, draft: string }[]>`
        SELECT
          COUNT(*) FILTER (WHERE t.status = 'Minted')::text AS minted,
          COUNT(*) FILTER (WHERE t.status = 'To_Mint')::text AS to_mint,
          COUNT(*) FILTER (WHERE t.status = 'Draft')::text AS draft          
        FROM
          public.tracks t;
    `;

      return {
        minted: parseInt(result[0].minted),
        toMint: parseInt(result[0].to_mint),
        draft: parseInt(result[0].draft)
      }
    }),
  get: adminProcedure
    .input(
      z.object({
        id: string()
      })
    )
    .query(async ({ ctx, input }) => {
      const track = await ctx.database.tracks.findUnique({
        include: {
          artists: true,
          authors_publishers: true,
          royalties_info: true,
          marketplace: true,
          user: true
        },
        where: {
          id: input.id
        }
      })

      if (!track) throw new TRPCError({ code: 'NOT_FOUND', message: 'Track not found' })

      return track
    }),
  delete: adminProcedure
    .input(
      z.object({
        id: string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const track = await ctx.database.tracks.findUnique({
        include: {
          artists: true,
          authors_publishers: true,
          royalties_info: true,
          marketplace: true,
          user: true
        },
        where: {
          id: input.id
        }
      })

      if (!track) throw new TRPCError({ code: 'NOT_FOUND', message: 'Track not found' })

      const s3Client = getS3Client()
      const bucket = useRuntimeConfig().awsS3BucketTracks

      // 1. delete audio from s3
      try {
        if (track.audio) {
          console.log('deleting audio from s3', track.audio)

          await s3Client.send(new DeleteObjectCommand({
            Bucket: bucket,
            Key: track.audio
          }))
          console.log('audio deleted from s3')
        }
      } catch (error) {
        console.error('Error deleting audio from s3', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Error deleting audio from s3' })
      }

      // 2. delete artwork from s3
      try {
        if (track.artwork) {
          console.log('deleting artwork from s3', track.artwork)

          await s3Client.send(new DeleteObjectCommand({
            Bucket: bucket,
            Key: track.artwork
          }))
          console.log('artwork deleted from s3')
        }
      } catch (error) {
        console.error('Error deleting artwork from s3', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Error deleting artwork from s3' })
      }

      // 3. delete video from s3
      try {
        if (track.video) {
          console.log('deleting video from s3', track.video)

          await s3Client.send(new DeleteObjectCommand({
            Bucket: bucket,
            Key: track.video
          }))
          console.log('video deleted from s3')
        }
      } catch (error) {
        console.error('Error deleting video from s3', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Error deleting video from s3' })
      }

      // 4. remove artists from db
      try {
        if (track.artists) {
          await ctx.database.track_artists.deleteMany({
            where: {
              track_id: track.id
            }
          })
        }
      } catch (error) {
        console.error('Error deleting artists from db', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Error deleting artists from db' })
      }

      // 5. remove authors_publishers from db
      try {
        if (track.authors_publishers) {
          await ctx.database.track_authors_publishers.deleteMany({
            where: {
              track_id: track.id
            }
          })
        }
      } catch (error) {
        console.error('Error deleting authors_publishers from db', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Error deleting authors_publishers from db' })
      }

      // 6. remove royalties_info from db
      try {
        if (track.royalties_info) {
          await ctx.database.track_royalties_info.deleteMany({
            where: {
              track_id: track.id
            }
          })
        }
      } catch (error) {
        console.error('Error deleting royalties_info from db', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Error deleting royalties_info from db' })
      }

      // 7. remove marketplace from db
      try {
        if (track.marketplace) {
          await ctx.database.track_marketplace.deleteMany({
            where: {
              track_id: track.id
            }
          })
        }
      } catch (error) {
        console.error('Error deleting marketplace from db', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Error deleting marketplace from db' })
      }

      // 8. remove track from db
      try {
        await ctx.database.tracks.delete({
          where: {
            id: track.id
          }
        })
      } catch (error) {
        console.error('Error deleting track from db', error)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Error deleting track from db' })
      }

      return {
        success: true
      }
    }),
})