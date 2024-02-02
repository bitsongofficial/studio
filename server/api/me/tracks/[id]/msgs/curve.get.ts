export default defineEventHandler(async (event) => {
  const { track } = await ensureUserTrack(event)

  if (!track.royalties_info) {
    throw createError({
      message: 'No royalties info',
      status: 404
    })
  }

  const generateSymbol = (name: string) => {
    let upperName = name.toUpperCase()
    return upperName.charAt(0) + upperName.slice(1).replace(/[AEIOU]/g, '');
  }

  const startTime = (time: number) => (time * 1000000000).toString()

  return {
    symbol: generateSymbol(track.title!),
    name: track.title,
    uri: `ipfs://${track.metadata_ipfs_cid}`,
    paymentDenom: "ubtsg",
    paymentAddress: track.payment_address,
    sellerFeeBps: Math.round(track.marketplace[0].creator_fee! * 100),
    referralFeeBps: Math.round(track.marketplace[0].referral_fee! * 100 / track.marketplace[0].creator_fee! * 100),
    startTime: startTime(track.start_time!),
    ratio: track.marketplace[0].ratio,
  }
})