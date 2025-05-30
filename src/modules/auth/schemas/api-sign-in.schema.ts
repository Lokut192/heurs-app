import { z } from 'zod/v4';

export const apiSignInSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});
