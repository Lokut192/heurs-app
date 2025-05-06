import { z } from 'zod';

export const apiGetMeSchema = z.object({
  id: z.number().positive(),
  email: z.email(),
  username: z.string(),
});
