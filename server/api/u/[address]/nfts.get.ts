import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

export default defineEventHandler(async (event) => {
  const address = getRouterParam(event, 'address')
  const nfts = await prismaClient.nfttokenview.findMany({
    where: {
      owner: address
    }
  })

  return nfts
})