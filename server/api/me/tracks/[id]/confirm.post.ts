import { ZodError } from "zod"
import { trackUpdateSchema } from "~/server/schema/trackUpdate"
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
        status: 'Minted',
        nft_address: data.nft_address?.trim(),
      },
      include: {
        artists: true,
        authors_publishers: true,
        royalties_info: true,
        marketplace: true,
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