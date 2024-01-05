import { PrismaClient } from "@prisma/client";
import { updatePodcastEpisodeSchema } from "~/server/schema";

export default defineEventHandler(async (event) => {
  const episode_id = getRouterParam(event, 'episode_id')

  if (!episode_id) {
    throw createError({
      message: 'Missing params',
      status: 400
    })
  }

  const body = await readBody(event)
  const { content: explicit, description, episode_type, title } = updatePodcastEpisodeSchema.parse(body)

  const user = await ensureAuth(event)

  const prismaClient = new PrismaClient();
  const episode = await prismaClient.episode.update({
    where: {
      id: episode_id,
      AND: {
        user_id: user.userId
      }
    },
    data: {
      title,
      description,
      explicit,
      episode_type,
    },
  })

  return {
    episode
  }
})