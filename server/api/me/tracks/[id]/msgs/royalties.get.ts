import { ContributorMsg } from "@bitsongjs/telescope/types/codegen/Bs721Factory.types";

export default defineEventHandler(async (event) => {
  const { track } = await ensureUserTrack(event)

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