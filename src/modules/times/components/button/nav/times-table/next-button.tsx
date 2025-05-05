'use client';

import { faArrowRight } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateTime } from 'luxon';
import { useContext } from 'react';
import { twMerge } from 'tailwind-merge';

import { TimesTableContext } from '@/modules/times/contexts/times-table.ctx';

export type NextTimesTableNavButtonProps =
  React.ComponentPropsWithoutRef<'button'>;

export const NextTimesTableNavButton: React.FC<
  NextTimesTableNavButtonProps
> = ({ children, ...props }) => {
  /* Context */
  const { setFrom, setTo } = useContext(TimesTableContext);

  /* Render */
  return (
    <button
      type="button"
      {...props}
      className={twMerge('btn btn-secondary', props.className ?? '')}
      onClick={(ev) => {
        props?.onClick?.(ev);
        setFrom((prevFrom) => {
          return DateTime.fromISO(prevFrom).plus({ month: 1 }).toISODate()!;
        });
        setTo((prevTo) => {
          return DateTime.fromISO(prevTo).plus({ month: 1 }).toISODate()!;
        });
      }}
    >
      {children ?? (
        <FontAwesomeIcon icon={faArrowRight} className="fa-fw fa-lg" />
      )}
    </button>
  );
};
