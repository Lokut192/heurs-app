'use client';

import { createContext } from 'react';

import type { useMonthStats } from '../hooks/queries/use-month-stats';
import type { ApiMonthStatistics } from '../schemas/api/get-month-stats.schema';

export const MonthStatsContext = createContext<{
  statistics: ApiMonthStatistics;
  statisticsQuery: ReturnType<typeof useMonthStats>;

  prevStatistics: ApiMonthStatistics;
  prevStatisticsQuery: ReturnType<typeof useMonthStats>;

  nextStatistics: ApiMonthStatistics;
  nextStatisticsQuery: ReturnType<typeof useMonthStats>;
  month: number;
  setMonth: React.Dispatch<React.SetStateAction<number>>;
  year: number;
  setYear: React.Dispatch<React.SetStateAction<number>>;
}>(null!);
