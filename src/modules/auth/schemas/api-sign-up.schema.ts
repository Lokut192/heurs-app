import { z } from 'zod/v4';

export const apiSignUpPayloadSchema = z
  .object({
    username: z.string(),
    email: z.email(),
    password: z.string().min(8),
    confirmPassword: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/,
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ApiSignUpPayload = z.infer<typeof apiSignUpPayloadSchema>;

export const apiSignUpReturnSchema = z.object({
  username: z.string(),
  email: z.email(),
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type ApiSignUpReturn = z.infer<typeof apiSignUpReturnSchema>;
