import _ from 'lodash';
import { twMerge } from 'tailwind-merge';

import type { ApiTimeType } from '../../enums/time-type.enum';

export type TimeTypeBadgeProps = React.ComponentPropsWithoutRef<'div'> & {
  timeType: ApiTimeType;
};

export const TimeTypeBadge: React.FC<TimeTypeBadgeProps> = ({
  timeType,
  ...props
}) => {
  /* Render */
  return (
    <div
      {...props}
      data-type={timeType}
      className={twMerge(
        'badge',
        `data-[type=OVERTIME]:bg-overtime data-[type=OVERTIME]:text-base-100 data-[type=RECOVERY]:text-base-content data-[type=RECOVERY]:dark:text-base-100 data-[type=RECOVERY]:bg-recovery`,
        props.className ?? '',
      )}
    >
      {_.upperFirst(_.lowerCase(timeType))}
    </div>
  );
};
