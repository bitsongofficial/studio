import { z } from 'zod';

export const dropNotificationSchema = z
  .object({
    email: z.string({
      required_error: 'Email is required',
    }).email({
      message: 'Email is invalid',
    }),
  })
