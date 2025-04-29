import { z } from 'zod';

export const apiSignInSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});
