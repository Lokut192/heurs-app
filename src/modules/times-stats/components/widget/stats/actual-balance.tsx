'use client';

import { DateTime } from 'luxon';
import { useRef } from 'react';

import { useYearStats } from '@/modules/times-stats/hooks/queries/use-year-stats';

import BalanceStatsWidget from './balance';

export type ActualBalanceStatsWidgetProps = object;

function ActualBalanceStatsWidget(
  _props: ActualBalanceStatsWidgetProps,
): React.ReactNode {
  const { current: currYear } = useRef<number>(DateTime.now().year);

  // Get current year balance
  const statsQuery = useYearStats({ year: currYear });

  // Render
  return (
    <BalanceStatsWidget
      balance={statsQuery.data.balance}
      title="Actual balance"
      description={
        <div className="stat-desc text-info whitespace-break-spaces">
          Balance to {currYear}
        </div>
      }
    />
  );
}

export default ActualBalanceStatsWidget as React.FC;
