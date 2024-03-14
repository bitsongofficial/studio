import { eventHandler } from "h3"
import { Prisma, PrismaClient } from "@prisma/client"
import { DefaultArgs } from "@prisma/client/runtime/library"

let prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>

export default eventHandler(async (event) => {
  if (prisma) {
    event.context.database = prisma
  } else {
    prisma = new PrismaClient()
    event.context.database = prisma
  }
})