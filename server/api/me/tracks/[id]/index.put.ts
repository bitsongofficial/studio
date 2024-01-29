import { PrismaClient } from "@prisma/client";
import { ZodError } from "zod";
import { trackUpdateSchema } from "~/server/schema/trackUpdate";

const prisma = new PrismaClient()
export default defineEventHandler(async (event) => {
  const user = await ensureAuth(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      message: 'No id',
      status: 400
    })
  }

  const _track = await prisma.tracks.findUnique({
    where: {
      id,
      user_id: user.userId,
    },
  })

  if (!_track) {
    throw createError({
      message: 'No track found',
      status: 404
    })
  }

  try {
    const data = trackUpdateSchema.parse(await readBody(event))

    if (data.artists && data.artists?.length > 0) {
      await prisma.track_artists.createMany(
        {
          data: data.artists.map((artist) => ({
            track_id: _track.id,
            id: `${_track.id}-${artist.address}`,
            name: artist.name,
            address: artist.address,
            role: artist.role,
          })),
          skipDuplicates: true,
        }
      )
    }

    const track = await prisma.tracks.update({
      where: {
        id,
        user_id: user.userId,
      },
      data: {
        title: data.title,
        titleLocale: data.titleLocale,
        version: data.version,
        description: data.description,
        genre: data.genre,
        country: data.country,
        license: data.license,
        previewStartTime: data.previewStartTime,
        previewDuration: data.previewDuration,
        explicit: data.explicit !== undefined ? (data.explicit ? 'Explicit' : 'Clean') : undefined,
        liveRecording: data.liveRecording,
        previousRelease: data.previousRelease,
        lyrics: data.lyrics,
        lyricsLocale: data.lyricsLocale,
      }
    })

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