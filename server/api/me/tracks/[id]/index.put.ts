import { ZodError } from "zod";
import { trackUpdateSchema } from "~/server/schema/trackUpdate";
import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const { track: _track, user } = await ensureUserTrack(event)

  try {
    const data = trackUpdateSchema.parse(await readBody(event))

    const track = await prisma.tracks.update({
      where: {
        id: _track.id,
        user_id: user.userId,
      },
      data: {
        title: data.title?.trim(),
        titleLocale: data.titleLocale?.trim(),
        version: data.version?.trim(),
        description: data.description?.trim(),
        genre: data.genre?.trim(),
        country: data.country?.trim(),
        license: data.license?.trim(),
        previewStartTime: data.previewStartTime,
        previewDuration: data.previewDuration,
        explicit: data.explicit !== undefined ? (data.explicit ? 'Explicit' : 'Clean') : undefined,
        liveRecording: data.liveRecording,
        previousRelease: data.previousRelease,
        lyrics: data.lyrics?.trim(),
        lyricsLocale: data.lyricsLocale?.trim(),
        start_time: data.start_time,
        payment_address: data.payment_address?.trim(),
        payment_denom: "ubtsg",
        nft_address: data.nft_address?.trim(),
      },
      include: {
        artists: true,
        authors_publishers: true,
        royalties_info: true,
        marketplace: true,
      }
    })

    if (data.artists && data.artists?.length > 0) {
      await prisma.track_artists.deleteMany({
        where: {
          track_id: _track.id,
        },
      })

      await prisma.track_artists.createMany({
        data: data.artists.map((artist) => ({
          track_id: _track.id,
          id: `${_track.id}-${artist.address}`,
          name: artist.name?.trim(),
          address: artist.address?.trim(),
          role: artist.role?.trim(),
        })),
        skipDuplicates: true,
      })
    }

    if (data.authors_publishers && data.authors_publishers?.length > 0) {
      await prisma.track_authors_publishers.deleteMany({
        where: {
          track_id: _track.id,
        },
      })

      await prisma.track_authors_publishers.createMany({
        data: data.authors_publishers.map((author_publisher) => ({
          track_id: _track.id,
          id: `${_track.id}-${author_publisher.address}`,
          name: author_publisher.name?.trim(),
          address: author_publisher.address?.trim(),
          role: author_publisher.role?.trim(),
        })),
        skipDuplicates: true,
      })
    }

    if (data.royalties_info && data.royalties_info?.length > 0) {
      await prisma.track_royalties_info.deleteMany({
        where: {
          track_id: _track.id,
        },
      })

      await prisma.track_royalties_info.createMany({
        data: data.royalties_info.map((royalties_info) => ({
          track_id: _track.id,
          id: `${_track.id}-${royalties_info.address}`,
          address: royalties_info.address?.trim(),
          role: royalties_info.role?.trim(),
          shares: royalties_info.shares,
        })),
        skipDuplicates: true,
      })
    }

    if (data.marketplace) {
      await prisma.track_marketplace.upsert({
        where: {
          id: _track.id,
        },
        create: {
          track_id: _track.id,
          id: _track.id,
          ratio: data.marketplace.ratio,
          creator_fee: data.marketplace.creator_fee,
          referral_fee: data.marketplace.referral_fee,
        },
        update: {
          ratio: data.marketplace.ratio,
          creator_fee: data.marketplace.creator_fee,
          referral_fee: data.marketplace.referral_fee,
        }
      })
    }

    return track
  } catch (e) {
    if (e instanceof ZodError) {
      throw createError({
        message: e.issues[0].message,
        status: 400
      })
    }

    throw createError({
      message: (e as Error).message,
      status: 400
    })
  }
})