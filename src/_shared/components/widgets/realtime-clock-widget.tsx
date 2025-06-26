'use client';

import { faClock } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { useMySetting } from '@/modules/me/hooks/queries/use-my-setting';

type RealtimeClockWidgetProps = Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'children'
>;

function RealtimeClockWidget({
  ...divProps
}: RealtimeClockWidgetProps): React.ReactNode {
  /* States */
  const [timezone, setTimezone] = useState<string>(
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClient, setIsClient] = useState<boolean>(false);

  /* Queries */
  // Get my timezone
  const myTimeZoneQuery = useMySetting({ settingCode: 'TIME_ZONE' });

  /* Callbacks */
  // const formatTime = useCallback((date: Date, tz: typeof timezone) => {
  //   return date.toLocaleString('en-EN', {
  //     timeZone: tz,
  //     weekday: 'long',
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric',
  //     hour: '2-digit',
  //     minute: '2-digit',
  //     second: '2-digit',
  //     hour12: false,
  //   });
  // }, []);
  const getTimeOnly = useCallback((date: Date, tz: typeof timezone) => {
    return date.toLocaleString('en-EN', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  }, []);
  const getDateOnly = useCallback((date: Date, tz: typeof timezone) => {
    return date.toLocaleDateString('en-EN', {
      timeZone: tz,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  /* Effects */
  // Check if client side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);
  // Update timezone state from query response
  useEffect(() => {
    if (
      myTimeZoneQuery.isSuccess &&
      typeof myTimeZoneQuery.data?.value === 'string'
    ) {
      setTimezone(myTimeZoneQuery.data.value);
    }
  }, [myTimeZoneQuery.data?.value]);
  // Update current time
  useEffect(() => {
    if (!isClient) return;

    const updateTime = () => {
      setCurrentTime(new Date());
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [isClient]);

  /* Render */
  return (
    <div {...divProps} className={twMerge('stat', divProps.className ?? '')}>
      <div className="stat-figure">
        <FontAwesomeIcon icon={faClock} className="fa-2xl text-primary fa-fw" />
      </div>
      <h3 className="stat-title">
        Realtime clock for <strong>{timezone}</strong>
      </h3>

      <div className="stat-value text-primary">
        {getTimeOnly(currentTime, timezone)}
      </div>

      <div className="stat-desc text-primary font-medium">
        {_.upperFirst(getDateOnly(currentTime, timezone))}
      </div>
    </div>
  );
}

export default RealtimeClockWidget as React.FC<RealtimeClockWidgetProps>;
