import { z } from 'zod';

export const trackUpdateSchema = z
  .object({
    title: z.string({
      required_error: 'Title is required',
    }).min(1, {
      message: 'Title must be at least 1 character',
    }).max(100, {
      message: 'Title must be at most 100 characters',
    })
      .transform((val) => val.trim())
      .optional(),
    titleLocale: z.string({
      required_error: 'Title locale is required',
    }).min(1, {
      message: 'Title locale must be at least 1 character',
    }).max(100, {
      message: 'Title locale must be at most 100 characters',
    })
      .transform((val) => val.trim())
      .optional(),
    version: z.string({
      required_error: 'Version is required',
    }).min(1, {
      message: 'Version must be at least 1 character',
    }).max(100, {
      message: 'Version must be at most 100 characters',
    })
      .transform((val) => val.trim())
      .optional(),
    description: z.string({
      required_error: 'Description is required',
    }).min(1, {
      message: 'Description must be at least 1 character',
    }).max(1000, {
      message: 'Description must be at most 1000 characters',
    })
      .transform((val) => val.trim())
      .optional(),
    genre: z.string({
      required_error: 'Genre is required',
    }).min(1, {
      message: 'Genre must be at least 1 character',
    }).max(100, {
      message: 'Genre must be at most 100 characters',
    })
      .transform((val) => val.trim())
      .optional(),
    country: z.string({
      required_error: 'Country is required',
    }).min(1, {
      message: 'Country must be at least 1 character',
    }).max(100, {
      message: 'Country must be at most 100 characters',
    })
      .transform((val) => val.trim())
      .optional(),
    license: z.string({
      required_error: 'License is required',
    }).min(1, {
      message: 'License must be at least 1 character',
    }).max(100, {
      message: 'License must be at most 100 characters',
    })
      .transform((val) => val.trim())
      .optional(),
    explicit: z.boolean().optional(),
    liveRecording: z.boolean().optional(),
    previousRelease: z.boolean().optional(),
    previewStartTime: z.number().optional(),
    previewDuration: z.number().optional(),
    lyrics: z.string({
      required_error: 'Lyrics are required',
    }).min(1, {
      message: 'Lyrics must be at least 1 character',
    }).max(1000, {
      message: 'Lyrics must be at most 1000 characters',
    })
      .transform((val) => val.trim())
      .optional(),
    lyricsLocale: z.string({
      required_error: 'Lyrics locale is required',
    }).min(1, {
      message: 'Lyrics locale must be at least 1 character',
    }).max(100, {
      message: 'Lyrics locale must be at most 100 characters',
    })
      .transform((val) => val.trim())
      .optional(),
    artists: z.array(z.object({
      address: z.string().optional(),
      name: z.string().optional(),
      role: z.string().optional(),
    })).optional(),
  })
