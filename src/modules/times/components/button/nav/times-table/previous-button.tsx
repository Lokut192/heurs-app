'use client';

import { faArrowLeft } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateTime } from 'luxon';
import { useContext } from 'react';
import { twMerge } from 'tailwind-merge';

import { TimesTableContext } from '@/modules/times/contexts/times-table.ctx';

export type PreviousTimesTableNavButtonProps =
  React.ComponentPropsWithoutRef<'button'>;

export const PreviousTimesTableNavButton: React.FC<
  PreviousTimesTableNavButtonProps
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
          return DateTime.fromISO(prevFrom).minus({ month: 1 }).toISODate()!;
        });
        setTo((prevTo) => {
          return DateTime.fromISO(prevTo).minus({ month: 1 }).toISODate()!;
        });
      }}
    >
      {children ?? (
        <FontAwesomeIcon icon={faArrowLeft} className="fa-fw fa-lg" />
      )}
    </button>
  );
};
