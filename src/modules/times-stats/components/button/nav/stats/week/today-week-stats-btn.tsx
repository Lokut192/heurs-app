'use client';

import _ from 'lodash';
import { DateTime } from 'luxon';
import { useContext } from 'react';
import { twMerge } from 'tailwind-merge';

import { WeekStatsContext } from '@/modules/times-stats/contexts/week-stats.ctx';

export type TodayWeekStatsButtonProps =
  React.ComponentPropsWithoutRef<'button'>;

export const TodayWeekStatsButton: React.FC<TodayWeekStatsButtonProps> = ({
  children,
  ...props
}) => {
  /* Context */
  const { setWeekNumber, setYear } = useContext(WeekStatsContext);

  /* Render */
  return (
    <button
      type="button"
      {...props}
      className={twMerge('btn btn-secondary', props.className ?? '')}
      onClick={(ev) => {
        props?.onClick?.(ev);
        setWeekNumber((_prevMonth) => {
          return DateTime.now().weekNumber;
        });
        setYear((_prevMonth) => {
          return DateTime.now().weekYear;
        });
      }}
    >
      {children ?? (
        <>
          Week{' '}
          {_.upperFirst(
            DateTime.now().setLocale('en').startOf('week').toFormat('WW'),
          )}
        </>
      )}
    </button>
  );
};
