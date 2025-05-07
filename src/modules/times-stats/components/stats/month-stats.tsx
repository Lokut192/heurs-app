'use client';

import { useContext } from 'react';

import { MonthStatsContext } from '../../contexts/month-stats.ctx';

export type MonthStatisticsProps = {};

export default function MonthStatistics(
  _props: MonthStatisticsProps,
): React.ReactNode {
  /* Context */
  // Get ctx values
  const { statistics, prevStatistics } = useContext(MonthStatsContext);

  /* Render */
  return (
    <pre>
      <code>
        {JSON.stringify({ prev: prevStatistics, curr: statistics }, null, 2)}
      </code>
    </pre>
  );
}
