'use client';

import axios, { HttpStatusCode, isAxiosError } from 'axios';
import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { useMemo } from 'react';

import { LoggedUserContext } from '../contexts/logged-user.ctx';

export type LoggedUserProviderProps = {
  children?: React.ReactNode;
  session: Session | null;
};

export default function LoggedUserProvider({
  children,
  session,
}: LoggedUserProviderProps) {
  /* Session */
  // const { update: updateSession } = useSession();

  /* Axios */
  // Create axios instance
  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        // Authorization: `Bearer ${session.user.accessToken}`,
        'x-timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      timeout: 5000,
      timeoutErrorMessage: 'Request timed out',
    });

    if (session === null) {
      return instance;
    }

    // Define user bearer
    instance.defaults.headers.common.Authorization = `Bearer ${session.user.accessToken}`;

    // Define axios response interceptors
    instance.interceptors.response.use(
      (response) => {
        return Promise.resolve(response);
      },
      async (error) => {
        if (isAxiosError(error)) {
          if (error.response) {
            switch (error.response.status) {
              case HttpStatusCode.Unauthorized:
                // TODO: Refresh token and resend request
                break;
              default:
                break;
            }
          }
        }
        return Promise.reject(error);
      },
    );

    return instance;
  }, [session?.user.accessToken, session?.user.refreshToken]);

  /* Render */
  return (
    <SessionProvider session={session}>
      <LoggedUserContext
        value={!!session ? { ...session.user, axiosInstance } : null}
      >
        {children}
      </LoggedUserContext>
    </SessionProvider>
  );
}
