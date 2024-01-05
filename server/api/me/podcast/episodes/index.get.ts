import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const user = await ensureAuth(event)

  const prismaClient = new PrismaClient();
  const episodes = await prismaClient.episode.findMany({
    where: {
      user_id: user.userId
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return {
    episodes
  }
})