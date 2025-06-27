'use client';

import { faArrowLeft } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateTime } from 'luxon';
import { useContext } from 'react';
import { twMerge } from 'tailwind-merge';

import { WeekStatsContext } from '@/modules/times-stats/contexts/week-stats.ctx';

export type PreviousWeekStatsNavButtonProps =
  React.ComponentPropsWithoutRef<'button'>;

export const PreviousWeekStatsNavButton: React.FC<
  PreviousWeekStatsNavButtonProps
> = ({ children, ...props }) => {
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
          return DateTime.fromObject({ weekNumber, weekYear: year }).minus({
            weeks: 1,
          }).weekNumber;
        });
        setYear((_prevYear) => {
          return DateTime.fromObject({ weekNumber, weekYear: year }).minus({
            weeks: 1,
          }).weekYear;
        });
      }}
    >
      {children ?? (
        <FontAwesomeIcon icon={faArrowLeft} className="fa-fw fa-lg" />
      )}
    </button>
  );
};
