import { getPodcastEpisodeByIdAndUserId } from '~/server/models';

export default defineEventHandler(async (event) => {
  const episode_id = getRouterParam(event, 'episode_id')

  if (!episode_id) {
    throw createError({
      message: 'Missing params',
      status: 400
    })
  }

  const user = await ensureAuth(event)
  const episode = await getPodcastEpisodeByIdAndUserId(episode_id, user.userId)
  if (!episode) {
    throw createError({
      message: 'Episode not found',
      status: 404
    })
  }

  return {
    episode
  }
})