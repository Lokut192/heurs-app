import { z } from 'zod/v4';

import { apiGetStatisticsSchema } from './get-stats.schema';

export const apiGetYearStatisticsSchema = apiGetStatisticsSchema.extend({
  weekAvgDuration: z.number(),
  monthAvgDuration: z.number(),
});

export type ApiYearStatistics = z.infer<typeof apiGetYearStatisticsSchema>;
