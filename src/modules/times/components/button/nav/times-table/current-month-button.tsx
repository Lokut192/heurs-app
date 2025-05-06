'use client';

import _ from 'lodash';
import { DateTime } from 'luxon';
import { useContext } from 'react';
import { twMerge } from 'tailwind-merge';

import { TimesTableContext } from '@/modules/times/contexts/times-table.ctx';

export type CurrentTimesTableNavButtonProps =
  React.ComponentPropsWithoutRef<'div'>;

export const CurrentTimesTableNavButton: React.FC<
  CurrentTimesTableNavButtonProps
> = ({ children, ...props }) => {
  /* Context */
  const { from } = useContext(TimesTableContext);

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
          DateTime.fromISO(from)
            .setLocale('en')
            .startOf('month')
            .toFormat('LLL yyyy'),
        )}
    </div>
  );
};
