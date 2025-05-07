import z from 'zod';

import { apiGetStatisticsSchema } from './get-stats.schema';

export const apiGetMonthStatisticsSchema = apiGetStatisticsSchema.extend({
  month: z.number(),
});

export type ApiMonthStatistics = z.infer<typeof apiGetMonthStatisticsSchema>;
