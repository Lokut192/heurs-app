'use client';

import { Duration } from 'luxon';
import { useContext, useMemo } from 'react';

import { WeekStatsContext } from '@/modules/times-stats/contexts/week-stats.ctx';

import BalanceStatsWidget from '../balance';

export type TotalWeekStatsProps = {};

function TotalWeekStats(_props: TotalWeekStatsProps): React.ReactNode {
  /* Context */
  // Values
  const { statistics, prevStatistics } = useContext(WeekStatsContext);

  const totalTimesCountDiff = useMemo(
    () => statistics.timesCount - prevStatistics.timesCount,
    [statistics.timesCount, prevStatistics.timesCount],
  );
  const totalTimesDurationDiff = useMemo(
    () => statistics.totalDuration - prevStatistics.totalDuration,
    [statistics.totalDuration, prevStatistics.totalDuration],
  );

  /* Render */
  return (
    <>
      {/* Total count */}
      <div className="stat">
        <div className="stat-title">Week total times entered</div>
        <div className="stat-value">{statistics.timesCount}</div>
        {totalTimesCountDiff !== 0 ? (
          <div
            data-diff={totalTimesCountDiff > 0 ? 'positive' : 'negative'}
            className="stat-desc data-[diff=negative]:text-warning data-[diff=positive]:text-success"
          >
            {Math.abs(totalTimesCountDiff)}{' '}
            {totalTimesCountDiff > 0 ? 'more' : 'less'} than previous week
          </div>
        ) : (
          <div className="stat-desc text-info">Same as last week</div>
        )}
      </div>

      {/* Balance */}
      <BalanceStatsWidget
        balance={statistics.totalDuration}
        title="Week balance"
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
              {totalTimesDurationDiff > 0 ? 'more' : 'less'} than previous week
            </div>
          ) : (
            <div className="stat-desc text-info">Same as last week</div>
          )
        }
      />
    </>
  );
}

export default TotalWeekStats as React.FC<TotalWeekStatsProps>;
