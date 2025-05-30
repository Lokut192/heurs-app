import { z } from 'zod/v4';

export const apiUsernameSchema = z.string().regex(/^[a-zA-Z0-9._-]{3,}$/, {
  error:
    'Username must be at least 3 characters long and contain only letters, numbers, dots, dashes, and underscores',
});
