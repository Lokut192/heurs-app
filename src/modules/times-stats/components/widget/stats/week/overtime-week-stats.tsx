'use client';

import { Duration } from 'luxon';
import { useContext, useMemo } from 'react';

import { WeekStatsContext } from '@/modules/times-stats/contexts/week-stats.ctx';

import BalanceStatsWidget from '../balance';

export type OvertimeWeekStatsProps = {};

function OvertimeWeekStats(_props: OvertimeWeekStatsProps): React.ReactNode {
  /* Context */
  // Values
  const { statistics, prevStatistics } = useContext(WeekStatsContext);

  const totalTimesCountDiff = useMemo(
    () => statistics.overtimeTimesCount - prevStatistics.overtimeTimesCount,
    [statistics.overtimeTimesCount, prevStatistics.overtimeTimesCount],
  );
  const totalTimesDurationDiff = useMemo(
    () =>
      statistics.overtimeTotalDuration - prevStatistics.overtimeTotalDuration,
    [statistics.overtimeTotalDuration, prevStatistics.overtimeTotalDuration],
  );

  /* Render */
  return (
    <>
      {/* Total count */}
      <div className="stat">
        <div className="stat-title">Week overtime times entered</div>
        <div className="stat-value">{statistics.overtimeTimesCount}</div>
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

      {/* Total duration */}
      <BalanceStatsWidget
        balance={statistics.overtimeTotalDuration}
        title="Week overtime total duration"
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

export default OvertimeWeekStats as React.FC<OvertimeWeekStatsProps>;
