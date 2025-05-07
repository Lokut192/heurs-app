'use client';

import { DateTime } from 'luxon';
import { useRef } from 'react';

import { useYearStats } from '@/modules/times-stats/hooks/queries/use-year-stats';

import BalanceStatsWidget from './balance';

export type ActualMonthAverageDurationStatsWidgetProps = object;

function ActualMonthAverageDurationStatsWidget(
  _props: ActualMonthAverageDurationStatsWidgetProps,
): React.ReactNode {
  const { current: currYear } = useRef<number>(DateTime.now().year);

  // Get current year balance
  const statsQuery = useYearStats({ year: currYear });

  // Render
  return (
    <BalanceStatsWidget
      balance={statsQuery.data.monthAvgDuration}
      title="Month average"
      description={
        <div className="stat-desc text-info whitespace-break-spaces">
          Average to {currYear} by month
        </div>
      }
    />
  );
}

export default ActualMonthAverageDurationStatsWidget as React.FC;
