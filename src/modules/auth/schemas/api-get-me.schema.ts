import { z } from 'zod/v4';

export const apiGetMeSchema = z.object({
  id: z.number().positive(),
  email: z.email(),
  username: z.string(),
});
