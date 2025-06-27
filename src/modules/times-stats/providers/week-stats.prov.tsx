'use client';

import { DateTime } from 'luxon';
import React, { useMemo, useState } from 'react';

import { WeekStatsContext } from '../contexts/week-stats.ctx';
import { useWeekStats } from '../hooks/queries/use-week-stats';

export type WeekStatisticsProviderProps = {
  defaultWeek?: number | undefined;
  defaultYear?: number | undefined;
  children?: React.ReactNode;
};

function WeekStatisticsProvider({
  defaultWeek,
  defaultYear,
  children,
}: WeekStatisticsProviderProps): React.ReactNode {
  /* States */
  const [weekNumber, setWeekNumber] = useState<number>(
    defaultWeek ?? DateTime.now().weekNumber,
  );
  const [year, setYear] = useState<number>(
    defaultYear ?? DateTime.now().weekYear,
  );

  /* Queries */
  // Get current week stats
  const statsQuery = useWeekStats({
    weekNumber,
    year,
  });
  // Get prev week stats
  const prevStatsQuery = useWeekStats({
    weekNumber: DateTime.fromObject({ weekNumber, weekYear: year }).minus({
      weeks: 1,
    }).weekNumber,
    year: DateTime.fromObject({ weekNumber, weekYear: year }).minus({
      weeks: 1,
    }).weekYear,
  });

  /* Context */
  // Value
  const ctxValue: React.ContextType<typeof WeekStatsContext> = useMemo(
    () => ({
      statistics: statsQuery.data,
      statisticsQuery: statsQuery,

      prevStatistics: prevStatsQuery.data,
      prevStatisticsQuery: prevStatsQuery,

      weekNumber,
      setWeekNumber,

      year,
      setYear,
    }),
    [weekNumber, year, statsQuery.fetchStatus, prevStatsQuery.fetchStatus],
  );

  /* Render */
  return (
    <WeekStatsContext.Provider value={ctxValue}>
      {children}
    </WeekStatsContext.Provider>
  );
}

export default WeekStatisticsProvider as React.FC<WeekStatisticsProviderProps>;
