import { z } from 'zod';
import sharp from 'sharp';

const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png'];
const MAX_FILE_SIZE = 1024 * 1024 * 8;

export const userUpdateProfileSchema = z
  .object({
    avatar: z
      .any()
      .optional()
      .nullable()
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
      ),
    cover: z
      .any()
      .optional()
      .nullable()
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
            (image.height >= 300 && image.width >= 1374) &&
            (image.width === image.height * 4.58)
          ))
        },
        'Image must be at least 300x1374px and have a 4:1 aspect ratio'
      )
    ,
    username: z.string({
      required_error: 'Username is required'
    }).min(4, 'Username must be at least 4 characters long')
      .max(30, 'Username must be at most 30 characters long')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain alphanumeric characters and underscores'),
  })