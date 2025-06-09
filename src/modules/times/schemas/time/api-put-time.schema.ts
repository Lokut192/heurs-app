import type { z } from 'zod/v4';

import { idSchema } from '@/_shared/schemas/id.schema';

import { apiPostTimeSchema } from './api-post-time.schema';

export const apiPutTimeSchema = apiPostTimeSchema.extend({
  id: idSchema,
});

export type ApiPutTime = z.infer<typeof apiPutTimeSchema>;
