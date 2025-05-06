'use client';

import { DateTime } from 'luxon';
import { useMemo, useState } from 'react';

import { TimesTableContext } from '../contexts/times-table.ctx';
import { useTimes } from '../hooks/queries/use-times';

export type TimesTableProviderProps = { children?: React.ReactNode };

export default function TimesTableProvider({
  children,
}: TimesTableProviderProps) {
  /* States */
  const [from, setFrom] = useState<string>(
    DateTime.now().startOf('month').toISODate(),
  );
  const [to, setTo] = useState<string>(
    DateTime.now().startOf('month').plus({ month: 1 }).toISODate(),
  );
  const [orderby, setOrderby] = useState<string | null>(null);
  const [order, setOrder] = useState<'asc' | 'desc' | null>(null);

  /* Queries */
  // Get times
  const timesQuery = useTimes({
    queryParams: {
      from,
      to,
      orderby: orderby ?? 'date',
      order: order ?? 'desc',
    },
  });

  /* Context */
  // Value
  const ctxValue: React.ContextType<typeof TimesTableContext> = useMemo(
    () => ({
      times: timesQuery.data ?? [],
      timesQuery,
      from,
      setFrom,
      to,
      setTo,
      order,
      setOrder,
      orderby,
      setOrderby,
    }),
    [timesQuery.status, timesQuery.fetchStatus, from, to, order, orderby],
  );

  /* Render */
  return <TimesTableContext value={ctxValue}>{children}</TimesTableContext>;
}
