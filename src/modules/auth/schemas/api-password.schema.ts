import z from 'zod';

export const apiPasswordSchema = z
  .string()
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
    message:
      'Password must contain at least 8 characters, one lowercase letter, one uppercase letter, one number and one special character',
  });
