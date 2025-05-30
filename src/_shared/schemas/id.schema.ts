import { z } from 'zod/v4';

export const idSchema = z.number().positive();
