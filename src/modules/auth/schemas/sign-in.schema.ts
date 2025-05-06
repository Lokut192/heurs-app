import { z } from 'zod';

export const signInSchema = z.object({
  login: z.string().nonempty(),
  password: z.string().nonempty(),
});
