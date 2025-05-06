import { z } from 'zod';

export const apiRefreshTokenSchema = z.object({
  accessToken: z.string(),
});
