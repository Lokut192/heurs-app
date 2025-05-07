'use client';

import _ from 'lodash';
import { DateTime } from 'luxon';
import { useContext } from 'react';
import { twMerge } from 'tailwind-merge';

import { MonthStatsContext } from '@/modules/times-stats/contexts/month-stats.ctx';

export type TodayStatsButtonProps = React.ComponentPropsWithoutRef<'button'>;

export const TodayStatsButton: React.FC<TodayStatsButtonProps> = ({
  children,
  ...props
}) => {
  /* Context */
  const { setMonth, setYear } = useContext(MonthStatsContext);

  /* Render */
  return (
    <button
      type="button"
      {...props}
      className={twMerge('btn btn-secondary', props.className ?? '')}
      onClick={(ev) => {
        props?.onClick?.(ev);
        setMonth((_prevMonth) => {
          return DateTime.now().month;
        });
        setYear((_prevMonth) => {
          return DateTime.now().year;
        });
      }}
    >
      {children ??
        _.upperFirst(
          DateTime.now().setLocale('en').startOf('month').toFormat('LLL yyyy'),
        )}
    </button>
  );
};
