import { z } from 'zod/v4';

export const apiGetTimezoneSchema = z.object({
  name: z.string(),
  offset: z.number(),
});

export type ApiGetTimezone = z.infer<typeof apiGetTimezoneSchema>;
