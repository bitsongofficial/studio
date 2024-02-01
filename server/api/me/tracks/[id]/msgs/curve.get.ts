import { toMarkdown, trackMetadata, LicenseType, TrackGenre, Country, TrackExpicit } from "@bitsongjs/metadata";
import pinataSDK from '@pinata/sdk'
import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
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
      artists: true,
      authors_publishers: true,
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

  return {
    symbol: "STMGRWT",
    name: track.title,
    uri: `ipfs://${track.metadata_ipfs_cid}`,
    paymentDenom: "ubtsg",
    paymentAddress: track.payment_address,
    sellerFeeBps: 500,
    referralFeeBps: 2000, // referral fee / seller fee * 10000
    startTime: "1706810400000000000",
    ratio: 50
  }
})