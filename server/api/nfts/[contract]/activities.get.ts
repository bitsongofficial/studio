import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

export default defineEventHandler(async (event) => {
  const contract = getRouterParam(event, 'contract')

  const activities = await prismaClient.nftactivityview.findMany({
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