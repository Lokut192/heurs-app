import { z } from 'zod/v4';

import { shortIsoDateSchema } from '@/_shared/schemas/short-iso-date.schema';

export const apiPostTimeSchema = z.object({
  duration: z.number().nonnegative(),
  type: z.string(),
  date: shortIsoDateSchema,
  notes: z.string().nullable(),
});

export type ApiPostTime = z.infer<typeof apiPostTimeSchema>;
