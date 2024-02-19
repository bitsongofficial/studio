import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { adminProcedure, router } from '../../trpc'
import { TrackMetadata, TrackSchema } from '@bitsongjs/metadata'
import { useIpfsLink } from '~/composables/useIpfsLink'
import sharp from 'sharp'
import ffmpeg, { FfprobeData } from 'fluent-ffmpeg'

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
  transcode: adminProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
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


      /**
       * Metadata
       */

      // fetch metadata
      const rawMetadata = await $fetch(useIpfsLink(nft.uri))
      if (!rawMetadata) throw new TRPCError({ code: 'NOT_FOUND', message: 'NFT metadata not found' })

      // validate metadata
      const metadata = TrackSchema.safeParse(rawMetadata)
      if (!metadata.success) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Invalid NFT metadata' })

      // save metadata to storage
      await useStorage('mnft').setItem(`${nft.id}/metadata`, metadata.data)

      /**
       * Image
       */

      // fetch image
      const fetchedImage = await $fetch(useIpfsLink(metadata.data.image))
      if (!fetchedImage) throw new TRPCError({ code: 'NOT_FOUND', message: 'NFT image not found' })

      // convert image to buffer
      const bufferImage = Buffer.from(await (fetchedImage as Blob).arrayBuffer())

      // create a sharp instance
      const rawImage = await sharp(bufferImage).metadata()
      console.log('format', rawImage.format)
      console.log('width', rawImage.width)
      console.log('height', rawImage.height)

      // save image to storage
      await useStorage('mnft').setItemRaw(`${nft.id}/image`, bufferImage)

      /**
       * Audio
       */
      const fetchedAudio = await $fetch(useIpfsLink(metadata.data.bitsong.audio))
      if (!fetchedAudio) throw new TRPCError({ code: 'NOT_FOUND', message: 'NFT audio not found' })

      // convert audio to buffer
      const bufferAudio = Buffer.from(await (fetchedAudio as Blob).arrayBuffer())

      // save audio to storage
      await useStorage('mnft').setItemRaw(`${nft.id}/audio`, bufferAudio)

      // get audio from storage
      const audio = await useStorage('mnft').getItem(`${nft.id}/audio`)

      // validate audio
      validateAudioData(await getMediaData('./storage/mnft/' + nft.id + '/audio'))
      console.log('audio is valid')

      /**
       * Video
       */
      // const fetchedVideo = await $fetch(useIpfsLink(metadata.data.bitsong.video))
      // if (!fetchedVideo) throw new TRPCError({ code: 'NOT_FOUND', message: 'NFT video not found' })

      // // convert video to buffer
      // const bufferVideo = Buffer.from(await (fetchedVideo as Blob).arrayBuffer())

      // // save video to storage
      // await useStorage('mnft').setItemRaw(`${nft.id}/video`, bufferVideo)

      // validate video

      /**
       * Transcoding
       */

      // 1. create audio preview
      // ex: ffmpeg -i audio.wav -ss 0 -t 15 preview.mp3
      await Promise.all([
        new Promise((resolve, reject) => {
          ffmpeg()
            .input('./storage/mnft/' + nft.id + '/audio')
            .setStartTime(0)
            .setDuration(15)
            .output('./storage/mnft/' + nft.id + '/audio-preview.mp3')
            .on('end', function () {
              console.log('audio-preview.mp3 created')
              resolve(true)
            })
            .on('error', function (err) {
              console.log('Error: ' + err.message)
              reject(err)
            })
            .run()
        }),
        // new Promise((resolve, reject) => {
        //   ffmpeg()
        //     .input('./storage/mnft/' + nft.id + '/audio')
        //     .audioCodec('libmp3lame')
        //     .audioBitrate('128k')
        //     .output('./storage/mnft/' + nft.id + '/audio-128.mp3')
        //     .on('end', function () {
        //       console.log('audio-128.mp3 created')
        //       resolve(true)
        //     })
        //     .on('error', function (err) {
        //       console.log('Error: ' + err.message)
        //       reject(err)
        //     })
        //     .run()
        // }),
        // new Promise((resolve, reject) => {
        //   ffmpeg()
        //     .input('./storage/mnft/' + nft.id + '/audio')
        //     .audioCodec('libmp3lame')
        //     .audioBitrate('320k')
        //     .output('./storage/mnft/' + nft.id + '/audio-320.mp3')
        //     .on('end', function () {
        //       console.log('audio-320.mp3 created')
        //       resolve(true)
        //     })
        //     .on('error', function (err) {
        //       console.log('Error: ' + err.message)
        //       reject(err)
        //     })
        //     .run()
        // }),
        // new Promise((resolve, reject) => {
        //   ffmpeg()
        //     .input('./storage/mnft/' + nft.id + '/audio')
        //     .audioCodec('libopus')
        //     .audioBitrate('128k')
        //     .output('./storage/mnft/' + nft.id + '/audio.opus')
        //     .on('end', function () {
        //       console.log('audio.opus created')
        //       resolve(true)
        //     })
        //     .on('error', function (err) {
        //       console.log('Error: ' + err.message)
        //       reject(err)
        //     })
        //     .run()
        // }),
        // new Promise((resolve, reject) => {
        //   ffmpeg()
        //     .input('./storage/mnft/' + nft.id + '/video')
        //     .videoCodec('libx264')
        //     .videoBitrate('720k')
        //     .output('./storage/mnft/' + nft.id + '/video-720.mp4')
        //     .on('end', function () {
        //       console.log('video-720.mp4 created')
        //       resolve(true)
        //     })
        //     .on('error', function (err) {
        //       console.log('Error: ' + err.message)
        //       reject(err)
        //     })
        //     .run()
        // }),
      ])

      console.log('transcoding done')

      return {
        success: true
      }

      //return metadata.data
    }),
})