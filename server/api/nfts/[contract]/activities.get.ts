import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const contract = getRouterParam(event, 'contract')

  if (!prisma) {
    throw createError({
      message: 'database is not available',
      status: 500
    })
  }

  const activities = await prisma.nftactivityview.findMany({
    where: {
      nft_id: contract
    },
    orderBy: {
      timestamp: 'desc'
    },
    take: 30
  })

  return activities
})