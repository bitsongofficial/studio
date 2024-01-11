import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

export default defineEventHandler(async (event) => {
  const address = getRouterParam(event, 'address')

  const user = await prismaClient.user.findUnique({
    where: {
      address
    },
    select: {
      avatar: true,
      cover: true,
      username: true,
    }
  })

  if (!user) {
    throw createError({
      message: "User not found",
      statusCode: 404
    });
  }

  return {
    address,
    ...user,
  }
});