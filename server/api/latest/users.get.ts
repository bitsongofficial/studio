import prisma from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  if (!prisma) {
    throw createError({
      message: 'database is not available',
      status: 500
    })
  }

  const latestUsers = await prisma.user.findMany({
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

  const totalUsers = await prisma.user.count()

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