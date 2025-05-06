'use client';

import { faArrowLeft } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateTime } from 'luxon';
import { useContext } from 'react';
import { twMerge } from 'tailwind-merge';

import { MonthStatsContext } from '@/modules/times-stats/contexts/month-stats.ctx';

export type PreviousMonthStatsNavButtonProps =
  React.ComponentPropsWithoutRef<'button'>;

export const PreviousMonthStatsNavButton: React.FC<
  PreviousMonthStatsNavButtonProps
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
          return DateTime.fromObject({ month, year }).minus({ month: 1 }).month;
        });
        setYear((_prevYear) => {
          return DateTime.fromObject({ month, year }).minus({ month: 1 }).year;
        });
      }}
    >
      {children ?? (
        <FontAwesomeIcon icon={faArrowLeft} className="fa-fw fa-lg" />
      )}
    </button>
  );
};
