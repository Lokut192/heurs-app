'use client';

import type { Session } from 'next-auth';
import { useMemo } from 'react';

import { LoggedUserContext } from '../contexts/logged-user.ctx';
import { useUserAxiosInstance } from '../hooks/use-user-axios-instance';

export type LoggedUserProviderProps = {
  children?: React.ReactNode;
  session: Session | null;
};

export default function LoggedUserProvider({
  children,
  session,
}: LoggedUserProviderProps) {
  /* Axios */
  const axiosInstance = useUserAxiosInstance();

  /* Context */
  // Value
  const ctxValue: React.ContextType<typeof LoggedUserContext> = useMemo(
    () => (!!session ? { ...session.user, axiosInstance } : null),
    [!!session, JSON.stringify(session?.user ?? {}), axiosInstance],
  );

  /* Render */
  return <LoggedUserContext value={ctxValue}>{children}</LoggedUserContext>;
}
