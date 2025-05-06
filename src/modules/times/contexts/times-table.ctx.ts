'use client';

import { createContext } from 'react';

import type { useTimes } from '../hooks/queries/use-times';
import type { ApiGetTime } from '../types/time';

export const TimesTableContext = createContext<{
  times: ApiGetTime[];
  timesQuery: ReturnType<typeof useTimes>;
  from: string;
  setFrom: React.Dispatch<React.SetStateAction<string>>;
  to: string;
  setTo: React.Dispatch<React.SetStateAction<string>>;
  orderby: string | null;
  setOrderby: React.Dispatch<React.SetStateAction<string | null>>;
  order: 'asc' | 'desc' | null;
  setOrder: React.Dispatch<React.SetStateAction<'asc' | 'desc' | null>>;
}>(null!);
