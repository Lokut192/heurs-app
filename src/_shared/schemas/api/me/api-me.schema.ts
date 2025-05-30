import { z } from 'zod/v4';

import { apiPasswordSchema } from '@/modules/auth/schemas/api-password.schema';

export const apiPutMeSchema = z.object({
  email: z.email(),
  username: z.string(),
});

export const apiPutMePasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: apiPasswordSchema,
});

export const apiGetMeSchema = apiPutMeSchema.extend({
  id: z.number().positive(),
});

export type ApiGetMe = z.infer<typeof apiGetMeSchema>;
export type ApPutMePassword = z.infer<typeof apiPutMePasswordSchema>;
export type ApiPutMe = z.infer<typeof apiPutMeSchema>;
