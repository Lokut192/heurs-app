'use client';

import _ from 'lodash';
import { DateTime } from 'luxon';
import { useContext, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

import { WeekStatsContext } from '@/modules/times-stats/contexts/week-stats.ctx';

export type CurrentWeekStatsButtonProps = React.ComponentPropsWithoutRef<'div'>;

export const CurrentWeekStatsButton: React.FC<CurrentWeekStatsButtonProps> = ({
  children,
  ...props
}) => {
  /* Context */
  const { weekNumber, year } = useContext(WeekStatsContext);

  const weekStart = useMemo(() => {
    return DateTime.fromObject({ weekNumber, weekYear: year })
      .startOf('week')
      .toLocaleString(DateTime.DATE_SHORT);
  }, [weekNumber, year]);
  const weekEnd = useMemo(() => {
    return DateTime.fromObject({ weekNumber, weekYear: year })
      .endOf('week')
      .toLocaleString(DateTime.DATE_SHORT);
  }, [weekNumber, year]);

  /* Render */
  return (
    <div
      {...props}
      className={twMerge(
        'text-secondary text-xl/9 font-semibold',
        props.className ?? '',
      )}
    >
      {children ?? (
        <>
          Week{' '}
          {_.upperFirst(
            DateTime.fromObject({ weekNumber, weekYear: year })
              .startOf('week')
              .toFormat('WW iiii'),
          )}{' '}
          ({weekStart} - {weekEnd})
        </>
      )}
    </div>
  );
};
