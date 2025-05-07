'use client';

import { DateTime } from 'luxon';
import { useRef } from 'react';

import { useYearStats } from '@/modules/times-stats/hooks/queries/use-year-stats';

import BalanceStatsWidget from './balance';

export type ActualWeekAverageDurationStatsWidgetProps = object;

function ActualWeekAverageDurationStatsWidget(
  _props: ActualWeekAverageDurationStatsWidgetProps,
): React.ReactNode {
  const { current: currYear } = useRef<number>(DateTime.now().year);

  // Get current year balance
  const statsQuery = useYearStats({ year: currYear });

  // Render
  return (
    <BalanceStatsWidget
      balance={statsQuery.data.weekAvgDuration}
      title="Week average"
      description={
        <div className="stat-desc text-info whitespace-break-spaces">
          Average to {currYear} by week
        </div>
      }
    />
  );
}

export default ActualWeekAverageDurationStatsWidget as React.FC;
