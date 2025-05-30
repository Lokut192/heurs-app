import { z } from 'zod/v4';

export const apiRefreshTokenSchema = z.object({
  accessToken: z.string(),
});
