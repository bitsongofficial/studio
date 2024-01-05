import { z } from 'zod';
import sharp from 'sharp';

const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png'];
const MAX_FILE_SIZE = 1024 * 1024 * 8;

export const createPodcastSchema = z.object({
  name: z.string().min(4, 'Name must be at least 4 characters').max(100, 'Name must be less than 100 characters'),
  description: z.string().min(4, 'Description must be at least 4 characters').max(250, 'Description must be less than 250 characters'),
  author: z.string().min(4, 'Author must be at least 4 characters').max(100, 'Author must be less than 100 characters'),
  category: z.string().min(1).max(100),
  language: z.string().min(1).max(100),
  content: z.union([z.literal('clean'), z.literal('explicit')]),
  /*image: z
    .any()
    .refine(
      (file) => {
        if (!file || file.data.toString().length === 0) return true
        return ACCEPTED_MIME_TYPES.includes(file.type)
      },
      'Invalid file format, supported formats are: jpeg, png'
    )
    .refine(
      (file) => {
        if (!file || file.data.toString().length === 0) return true
        return file.data.length < MAX_FILE_SIZE
      }
    ).
    refine(
      (file) => {
        if (!file || file.data.toString().length === 0) return true
        return sharp(file.data).metadata().then((image) => (
          (image.height && image.width) &&
          (image.height >= 400 && image.width >= 400) &&
          (image.width === image.height * 1)
        ))
      },
      'Image must be at least 400x400px and have a 1:1 aspect ratio'
    ),*/
})