import { PrismaClient } from "@prisma/client"

export default defineEventHandler(async (event) => {
  const latestUsers = await prismaClient.user.findMany({
    take: 25,
    orderBy: {
      created_at: 'desc'
    },
    select: {
      address: true,
      avatar: true,
      username: true,
    }
  })

  const prismaClient = new PrismaClient()
  const totalUsers = await prismaClient.user.count()

  // sort users with avatar and username first
  latestUsers.sort((a, b) => {
    if (a.avatar && !b.avatar) return -1
    if (!a.avatar && b.avatar) return 1
    if (a.username && !b.username) return -1
    if (!a.username && b.username) return 1
    return 0
  })

  return {
    total: totalUsers,
    users: latestUsers
  }
})