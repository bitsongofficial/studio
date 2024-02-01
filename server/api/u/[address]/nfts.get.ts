import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const address = getRouterParam(event, 'address')

  const nfts = await prisma.nfttokenview.findMany({
    where: {
      owner: address
    }
  })

  return nfts
})