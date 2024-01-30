import { toMarkdown, trackMetadata, LicenseType, TrackGenre, Country, TrackExpicit } from "@bitsongjs/metadata";
import { PrismaClient } from "@prisma/client";
import pinataSDK from '@pinata/sdk'

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

  const metadata = trackMetadata({
    id: track.id,
    title: track.title!,
    titleLocale: "en",
    description: toMarkdown(track.description!),
    artists: track.artists.map((artist) => ({
      name: artist.name,
      role: artist.role,
      address: artist.address,
    })),
    artwork: "ipfs://QmYWrmVQnEYL317cZbsAH9wv6eJihbdpxjPDyLtbotR2Zq",
    audio: "ipfs://QmRS3uRQ929bMa5683G7jKagpQ4nwcbmB3bAihjsCg2XAo",
    duration: 142000,
    license: LicenseType.ALL_RIGHTS_RESERVED,
    genre: TrackGenre.DRUM_AND_BASS,
    country: Country.ITALY,
    explicit: TrackExpicit.CLEAN,
    liveRecording: false,
    previousRelease: false,
    previewStartTime: 0,
    previewDuration: 15000,
    label: "Delta9 Recordings",
    authors_publishers: track.authors_publishers.map((author) => ({
      name: author.name,
      role: author.role,
      address: author.address,
    })),
  })

  const pinata = new pinataSDK(useRuntimeConfig().pinataApiKey, useRuntimeConfig().pinataApiSecret);
  const { IpfsHash: cid } = await pinata.pinJSONToIPFS(metadata, { pinataMetadata: { name: `track_exept_amnesia_metadata.json` } })

  return {
    symbol: "MNFTEXAMN",
    name: track.title,
    uri: `ipfs://${cid}`,
    paymentDenom: "ubtsg",
    paymentAddress: "",
    sellerFeeBps: 500,
    referralFeeBps: 2000,
    startTime: "1706637600000000000",
    ratio: 100
  }
})