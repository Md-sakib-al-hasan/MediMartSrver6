import { z } from 'zod';

export const MessageZodSchema = z.object({
  body: z.object({
    message: z.string().min(1, { message: 'Message content is required' }),
  }),
});
