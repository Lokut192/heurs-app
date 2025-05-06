'use client';

import _ from 'lodash';
import { DateTime } from 'luxon';
import { useContext } from 'react';
import { twMerge } from 'tailwind-merge';

import { TimesTableContext } from '@/modules/times/contexts/times-table.ctx';

export type TodayTimesTableNavButtonProps =
  React.ComponentPropsWithoutRef<'button'>;

export const TodayTimesTableNavButton: React.FC<
  TodayTimesTableNavButtonProps
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
        setFrom((_prevFrom) => {
          return DateTime.now().startOf('month').toISODate()!;
        });
        setTo((_prevTo) => {
          return DateTime.now()
            .startOf('month')
            .plus({ month: 1 })
            .toISODate()!;
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
