import { Episode, Podcast, PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

const prismaClient = new PrismaClient();

export async function getPodcastByUserId(user_id: string): Promise<Podcast | null> {
  return await prismaClient.podcast.findFirst({
    where: { user_id }
  })
}

export async function getPodcastEpisodeByIdAndUserId(episode_id: string, user_id: string): Promise<Episode | null> {
  return await prismaClient.episode.findFirst({
    where: {
      id: episode_id,
      AND: {
        user_id
      }
    }
  })
}

interface CreatePodcastArgs {
  name: string;
  description: string;
  author: string;
  category: string;
  language: string;
  content: "clean" | "explicit";
  image: string;
  user_id: string;
}

export async function createPodcast(data: CreatePodcastArgs): Promise<Podcast | null> {
  return await prismaClient.podcast.create({ data })
}

interface CreatePodcastEpisodeArgs {
  episode_id?: string;
  podcast_id: string;
  content_type: string;
  audio_original: string;
  user_id: string;
}

export async function createPodcastEpisode(data: CreatePodcastEpisodeArgs): Promise<Episode | null> {
  return await prismaClient.episode.create({
    data: {
      podcast_id: data.podcast_id,
      content_type: data.content_type,
      plays: 0,
      length: 0,
      audio_original: data.audio_original,
      status: 'DRAFT',
      user_id: data.user_id,
    }
  })
}