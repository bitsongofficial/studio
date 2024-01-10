import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

export default defineEventHandler(async (event) => {
  const user = await ensureAuth(event)

  const nfts = await prismaClient.nfttokenview.findMany({
    where: {
      owner: user.address
    }
  })

  return nfts
})