'use client';

import { faArrowRight } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateTime } from 'luxon';
import { useContext } from 'react';
import { twMerge } from 'tailwind-merge';

import { MonthStatsContext } from '@/modules/times-stats/contexts/month-stats.ctx';

export type NextMonthStatsNavButtonProps =
  React.ComponentPropsWithoutRef<'button'>;

export const NextMonthStatsNavButton: React.FC<
  NextMonthStatsNavButtonProps
> = ({ children, ...props }) => {
  /* Context */
  const { month, setMonth, year, setYear } = useContext(MonthStatsContext);

  /* Render */
  return (
    <button
      type="button"
      {...props}
      className={twMerge('btn btn-soft btn-secondary', props.className ?? '')}
      onClick={(ev) => {
        props?.onClick?.(ev);
        setMonth((_prevYear) => {
          return DateTime.fromObject({ month, year }).plus({ month: 1 }).month;
        });
        setYear((_prevYear) => {
          return DateTime.fromObject({ month, year }).plus({ month: 1 }).year;
        });
      }}
    >
      {children ?? (
        <FontAwesomeIcon icon={faArrowRight} className="fa-fw fa-lg" />
      )}
    </button>
  );
};
