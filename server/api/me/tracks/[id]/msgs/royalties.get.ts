import { ContributorMsg } from "@bitsongjs/telescope/types/codegen/Bs721Factory.types";
import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient()
  const user = await ensureAuth(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      message: 'No id',
      status: 400
    })
  }

  const track = await prisma.tracks.findUnique({
    where: {
      id,
      user_id: user.userId,
    },
    include: {
      royalties_info: true,
    }
  })

  if (!track) {
    throw createError({
      message: 'No track found',
      status: 404
    })
  }

  if (!track.royalties_info) {
    throw createError({
      message: 'No royalties info',
      status: 404
    })
  }

  const contributors: ContributorMsg[] = track.royalties_info.map((royalty) => {
    return {
      role: royalty.role,
      shares: royalty.shares,
      address: royalty.address,
    }
  })

  return {
    denom: 'ubtsg',
    contributors
  }
})