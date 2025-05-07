import z from 'zod';

export const apiGetStatisticsSchema = z.object({
  overtimeTimesCount: z.number(),
  overtimeTotalDuration: z.number(),
  recoveryTimesCount: z.number(),
  recoveryTotalDuration: z.number(),
  timesCount: z.number(),
  totalDuration: z.number(),
  year: z.number(),
  balance: z.number(),
  updatedAt: z.iso.datetime({ precision: 3 }),
});

export type ApiStatistics = z.infer<typeof apiGetStatisticsSchema>;
