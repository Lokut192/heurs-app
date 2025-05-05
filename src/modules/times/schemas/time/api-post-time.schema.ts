import z from 'zod';

import { shortIsoDateSchema } from '@/_shared/schemas/short-iso-date.schema';

export const apiPostTimeSchema = z.object({
  duration: z.number().nonnegative(),
  type: z.string(),
  date: shortIsoDateSchema,
});

export type ApiPostTime = z.infer<typeof apiPostTimeSchema>;
