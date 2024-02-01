import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const address = getRouterParam(event, 'address')

  const prismaClient = new PrismaClient();
  const nfts = await prismaClient.nfttokenview.findMany({
    where: {
      owner: address
    }
  })

  return nfts
})