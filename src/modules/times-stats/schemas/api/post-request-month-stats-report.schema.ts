import { z } from 'zod/v4';

export const apiPostRequestMonthStatsReportPayloadSchema = z.object({
  month: z.number(),
  year: z.number(),
});

export type ApiPostRequestMonthStatsReportPayload = z.infer<
  typeof apiPostRequestMonthStatsReportPayloadSchema
>;
