'use client';

import { faArrowRight } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateTime } from 'luxon';
import { useContext } from 'react';
import { twMerge } from 'tailwind-merge';

import { WeekStatsContext } from '@/modules/times-stats/contexts/week-stats.ctx';

export type NextWeekStatsNavButtonProps =
  React.ComponentPropsWithoutRef<'button'>;

export const NextWeekStatsNavButton: React.FC<NextWeekStatsNavButtonProps> = ({
  children,
  ...props
}) => {
  /* Context */
  const { weekNumber, setWeekNumber, year, setYear } =
    useContext(WeekStatsContext);

  /* Render */
  return (
    <button
      type="button"
      {...props}
      className={twMerge('btn btn-secondary', props.className ?? '')}
      onClick={(ev) => {
        props?.onClick?.(ev);
        setWeekNumber((_prevWeekNumber) => {
          return DateTime.fromObject({ weekNumber, weekYear: year }).plus({
            weeks: 1,
          }).weekNumber;
        });
        setYear((_prevYear) => {
          return DateTime.fromObject({ weekNumber, weekYear: year }).plus({
            weeks: 1,
          }).weekYear;
        });
      }}
    >
      {children ?? (
        <FontAwesomeIcon icon={faArrowRight} className="fa-fw fa-lg" />
      )}
    </button>
  );
};
