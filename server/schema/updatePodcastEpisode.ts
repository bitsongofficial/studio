import { z } from 'zod';

export const updatePodcastEpisodeSchema = z.object({
  title: z.string().min(4, 'Title must be at least 4 characters').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(4, 'Description must be at least 4 characters').max(250, 'Description must be less than 250 characters'),
  content: z.union([z.literal('clean'), z.literal('explicit')]),
  episode_type: z.union([z.literal('full'), z.literal('trailer'), z.literal('bonus')]),
})