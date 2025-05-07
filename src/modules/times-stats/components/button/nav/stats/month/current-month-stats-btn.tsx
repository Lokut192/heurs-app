'use client';

import _ from 'lodash';
import { DateTime } from 'luxon';
import { useContext } from 'react';
import { twMerge } from 'tailwind-merge';

import { MonthStatsContext } from '@/modules/times-stats/contexts/month-stats.ctx';

export type CurrentMonthStatsButtonProps =
  React.ComponentPropsWithoutRef<'div'>;

export const CurrentMonthStatsButton: React.FC<
  CurrentMonthStatsButtonProps
> = ({ children, ...props }) => {
  /* Context */
  const { month, year } = useContext(MonthStatsContext);

  /* Render */
  return (
    <div
      {...props}
      className={twMerge(
        'text-secondary text-xl/9 font-semibold',
        props.className ?? '',
      )}
    >
      {children ??
        _.upperFirst(
          DateTime.fromObject({ month, year })
            .setLocale('en')
            .startOf('month')
            .toFormat('LLL yyyy'),
        )}
    </div>
  );
};
