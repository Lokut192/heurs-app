import _ from 'lodash';
import { useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

import { ApiTimeType } from '../../enums/time-type.enum';

export type TimeTypeBadgeProps = React.ComponentPropsWithoutRef<'div'> & {
  timeType: ApiTimeType;
};

export const TimeTypeBadge: React.FC<TimeTypeBadgeProps> = ({
  timeType,
  ...props
}) => {
  /* Memoized values */
  // Define time type badge color
  const timeTypeBadgeColor = useMemo(() => {
    switch (timeType) {
      case ApiTimeType.Overtime:
        return 'badge-primary';
      default:
        return '';
    }
  }, [timeType]);

  /* Render */
  return (
    <div
      {...props}
      className={twMerge('badge', timeTypeBadgeColor, props.className ?? '')}
    >
      {_.upperFirst(_.lowerCase(timeType))}
    </div>
  );
};
