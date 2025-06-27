'use client';

import { createContext } from 'react';

import type { useWeekStats } from '../hooks/queries/use-week-stats';
import type { ApiWeekStatistics } from '../schemas/api/get-week-stats.schema';

export const WeekStatsContext = createContext<{
  statistics: ApiWeekStatistics;
  statisticsQuery: ReturnType<typeof useWeekStats>;

  prevStatistics: ApiWeekStatistics;
  prevStatisticsQuery: ReturnType<typeof useWeekStats>;

  weekNumber: number;
  setWeekNumber: React.Dispatch<React.SetStateAction<number>>;
  year: number;
  setYear: React.Dispatch<React.SetStateAction<number>>;
}>(null!);
