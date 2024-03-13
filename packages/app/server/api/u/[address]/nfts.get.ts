import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const address = getRouterParam(event, 'address')

  if (!prisma) {
    throw createError({
      message: 'database is not available',
      status: 500
    })
  }

  const nfts = await prisma.nfttokenview.findMany({
    where: {
      owner: address
    }
  })

  return nfts
})