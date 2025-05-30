import { z } from 'zod/v4';

export const apiErrorSchema = z.object({
  error: z.string().optional(),
  message: z.string(),
  statusCode: z.number(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;
