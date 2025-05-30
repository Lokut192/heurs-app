import { z } from 'zod/v4';

export const signInSchema = z.object({
  login: z.string().nonempty(),
  password: z.string().nonempty(),
});
