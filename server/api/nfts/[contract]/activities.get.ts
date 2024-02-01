import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const contract = getRouterParam(event, 'contract')

  const prismaClient = new PrismaClient();
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