'use client';

import { Duration } from 'luxon';
import { useContext, useMemo } from 'react';

import { MonthStatsContext } from '@/modules/times-stats/contexts/month-stats.ctx';

export type TotalMonthStatsProps = {};

function TotalMonthStats(_props: TotalMonthStatsProps): React.ReactNode {
  /* Context */
  // Values
  const { statistics, prevStatistics } = useContext(MonthStatsContext);

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
        <div className="stat-title">Month total times entered</div>
        <div className="stat-value">{statistics.timesCount}</div>
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
      <div className="stat">
        <div className="stat-title">Month balance</div>
        <div className="stat-value">
          {Duration.fromObject({ minutes: statistics.totalDuration })
            .shiftTo('hours', 'minutes')
            .toFormat("h'h' mm'm'")}
        </div>
        {totalTimesDurationDiff !== 0 ? (
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
        )}
      </div>
    </>
  );
}

export default TotalMonthStats as React.FC<TotalMonthStatsProps>;
