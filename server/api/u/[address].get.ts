import { PrismaClient } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const address = getRouterParam(event, 'address')

  const selectColumns = {
    avatar: true,
    cover: true,
    username: true,
    email: false,
  }

  // If the user is requesting their own profile, return also their email
  const authRequest = auth.handleRequest(event);
  const session = await authRequest.validate();
  if (session?.user?.address === address) {
    selectColumns.email = true
  }

  const prismaClient = new PrismaClient();
  const user = await prismaClient.user.findUnique({
    where: {
      address
    },
    select: selectColumns
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