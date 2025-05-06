import type z from 'zod';

import { apiGetStatisticsSchema } from './get-stats.schema';

export const apiGetMonthStatisticsSchema = apiGetStatisticsSchema;

export type ApiMonthStatistics = z.infer<typeof apiGetMonthStatisticsSchema>;
