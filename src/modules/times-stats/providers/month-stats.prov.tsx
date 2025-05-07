'use client';

import { DateTime } from 'luxon';
import React, { useMemo, useState } from 'react';

import { MonthStatsContext } from '../contexts/month-stats.ctx';
import { useMonthStats } from '../hooks/queries/use-month-stats';

export type MonthStatisticsProviderProps = {
  defaultMonth?: number | undefined;
  defaultYear?: number | undefined;
  children?: React.ReactNode;
};

function MonthStatisticsProvider({
  defaultMonth,
  defaultYear,
  children,
}: MonthStatisticsProviderProps): React.ReactNode {
  /* States */
  const [month, setMonth] = useState<number>(
    defaultMonth ?? DateTime.now().month,
  );
  const [year, setYear] = useState<number>(defaultYear ?? DateTime.now().year);

  /* Queries */
  // Get current month stats
  const statsQuery = useMonthStats({
    monthNumber: month,
    year,
  });
  // Get prev month stats
  const prevStatsQuery = useMonthStats({
    monthNumber: DateTime.fromObject({ month, year }).minus({ months: 1 })
      .month,
    year: DateTime.fromObject({ month, year }).minus({ months: 1 }).year,
  });

  /* Context */
  // Value
  const ctxValue: React.ContextType<typeof MonthStatsContext> = useMemo(
    () => ({
      statistics: statsQuery.data,
      statisticsQuery: statsQuery,

      prevStatistics: prevStatsQuery.data,
      prevStatisticsQuery: prevStatsQuery,

      month,
      setMonth,
      year,
      setYear,
    }),
    [month, year, statsQuery.fetchStatus, prevStatsQuery.fetchStatus],
  );

  /* Render */
  return (
    <MonthStatsContext.Provider value={ctxValue}>
      {children}
    </MonthStatsContext.Provider>
  );
}

export default MonthStatisticsProvider as React.FC<MonthStatisticsProviderProps>;
