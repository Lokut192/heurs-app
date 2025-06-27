import { z } from 'zod/v4';

import { apiGetStatisticsSchema } from './get-stats.schema';

export const apiGetWeekStatisticsSchema = apiGetStatisticsSchema.extend({
  week: z.number(),
});

export type ApiWeekStatistics = z.infer<typeof apiGetWeekStatisticsSchema>;
