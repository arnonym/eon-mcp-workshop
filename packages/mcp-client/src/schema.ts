import { z } from 'zod';
import { randomUUID } from 'crypto';

export const AskSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  threadId: z
    .string()
    .optional()
    .default(() => randomUUID()),
});
