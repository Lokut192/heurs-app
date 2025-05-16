'use client';

import { Duration } from 'luxon';
import { useContext, useMemo } from 'react';

import { MonthStatsContext } from '@/modules/times-stats/contexts/month-stats.ctx';

import BalanceStatsWidget from '../balance';

export type RecoveryMonthStatsProps = {};

function RecoveryMonthStats(_props: RecoveryMonthStatsProps): React.ReactNode {
  /* Context */
  // Values
  const { statistics, prevStatistics } = useContext(MonthStatsContext);

  const totalTimesCountDiff = useMemo(
    () => statistics.recoveryTimesCount - prevStatistics.recoveryTimesCount,
    [statistics.recoveryTimesCount, prevStatistics.recoveryTimesCount],
  );
  const totalTimesDurationDiff = useMemo(
    () =>
      statistics.recoveryTotalDuration - prevStatistics.recoveryTotalDuration,
    [statistics.recoveryTotalDuration, prevStatistics.recoveryTotalDuration],
  );

  /* Render */
  return (
    <>
      {/* Total count */}
      <div className="stat">
        <div className="stat-title">Month recovery times entered</div>
        <div className="stat-value">{statistics.recoveryTimesCount}</div>
        {totalTimesCountDiff !== 0 ? (
          <div
            data-diff={totalTimesCountDiff > 0 ? 'positive' : 'negative'}
            className="stat-desc data-[diff=negative]:text-warning data-[diff=positive]:text-success"
          >
            {Math.abs(totalTimesCountDiff)}{' '}
            {totalTimesCountDiff > 0 ? 'more' : 'less'} than last month
          </div>
        ) : (
          <div className="stat-desc text-info">Same as last month</div>
        )}
      </div>

      {/* Total duration */}
      <BalanceStatsWidget
        balance={statistics.recoveryTotalDuration}
        title="Month recovery total duration"
        description={
          totalTimesDurationDiff !== 0 ? (
            <div
              data-diff={totalTimesDurationDiff > 0 ? 'positive' : 'negative'}
              className="stat-desc data-[diff=negative]:text-warning data-[diff=positive]:text-success"
            >
              {Duration.fromObject({
                minutes: Math.abs(totalTimesDurationDiff),
              })
                .shiftTo('hours', 'minutes')
                .toFormat("h'h' mm'm'")}{' '}
              {totalTimesDurationDiff > 0 ? 'more' : 'less'} than last month
            </div>
          ) : (
            <div className="stat-desc text-info">Same as last month</div>
          )
        }
      />
    </>
  );
}

export default RecoveryMonthStats as React.FC<RecoveryMonthStatsProps>;
