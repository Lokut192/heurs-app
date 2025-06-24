'use client';

import type { Session } from 'next-auth';
import { useCallback, useMemo } from 'react';

import { LoggedUserContext } from '../contexts/logged-user.ctx';
import type { Roles } from '../enums/roles.enum';
import { useUserAxiosInstance } from '../hooks/use-user-axios-instance';

export type LoggedUserProviderProps = {
  children?: React.ReactNode;
  session: Session | null;
  roles?: Roles[];
  grants?: string[];
};

export default function LoggedUserProvider({
  children,
  session,
  roles = [],
  grants = [],
}: LoggedUserProviderProps) {
  /* Axios */
  const axiosInstance = useUserAxiosInstance();

  /* Callback */
  const loggedUserHasSomGrants = useCallback(
    (...grantsToCheck: string[]) => {
      return grantsToCheck.some((grant) => grants.includes(grant));
    },
    [grants.length],
  );
  const loggedUserHasEveryGrants = useCallback(
    (...grantsToCheck: string[]) => {
      return grantsToCheck.every((grant) => grants.includes(grant));
    },
    [grants.length],
  );

  /* Context */
  // Value
  const ctxValue: React.ContextType<typeof LoggedUserContext> = useMemo(
    () =>
      !!session
        ? {
            ...session.user,
            axiosInstance,

            roles,
            grants,

            hasSomeGrants: loggedUserHasSomGrants,
            hasEveryGrants: loggedUserHasEveryGrants,
          }
        : null,
    [
      !!session,

      JSON.stringify(session?.user ?? {}),

      axiosInstance,

      grants.length,
      roles.length,

      loggedUserHasSomGrants,
      loggedUserHasEveryGrants,
    ],
  );

  /* Render */
  return <LoggedUserContext value={ctxValue}>{children}</LoggedUserContext>;
}
