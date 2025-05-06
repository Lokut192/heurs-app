'use client';

import axios, { HttpStatusCode, isAxiosError } from 'axios';
import type { Session } from 'next-auth';
import { SessionProvider, signOut } from 'next-auth/react';
import { useMemo } from 'react';
import type z from 'zod';

import { LoggedUserContext } from '../contexts/logged-user.ctx';
import { apiRefreshTokenSchema } from '../schemas/api-refresh-token.schema';

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
        'x-timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
        'Content-Type': 'application/json',
      },
      responseType: 'json',
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
          const baseRequest = error.config;

          if (!!error.response && !!baseRequest) {
            if (error.response.status === HttpStatusCode.Unauthorized) {
              if (
                baseRequest.url !== '/auth/sign-in' &&
                baseRequest.url !== '/auth/sign-up' &&
                typeof session.user.refreshToken === 'string'
              ) {
                const {
                  user: { refreshToken },
                } = session;

                try {
                  const refreshResponse = await axios.post<
                    z.infer<typeof apiRefreshTokenSchema>
                  >(`/auth/refresh`, null, {
                    baseURL: process.env.NEXT_PUBLIC_API_URL,
                    headers: {
                      'x-timezone':
                        Intl.DateTimeFormat().resolvedOptions().timeZone,
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${refreshToken}`,
                    },
                    responseType: 'json',
                    timeout: 5000,
                    timeoutErrorMessage: 'Request timed out',
                  });

                  const parsedRefreshTokenData =
                    apiRefreshTokenSchema.safeParse(refreshResponse.data);

                  if (!!parsedRefreshTokenData.error) {
                    await signOut();
                    return;
                  }

                  instance.defaults.headers.common.Authorization = `Bearer ${parsedRefreshTokenData.data.accessToken}`;

                  return instance(baseRequest);
                } catch (refreshError) {
                  if (isAxiosError(refreshError) && refreshError.response) {
                    if (error.response.status === HttpStatusCode.Unauthorized) {
                      await signOut();
                      return;
                    }
                  }
                  return Promise.reject(error);
                }
              } else if (baseRequest.url === '/auth/refresh') {
                await signOut();
                return;
              }
            }
          }
        }

        return Promise.reject(error);
      },
    );

    return instance;
  }, [session?.user.accessToken, session?.user.refreshToken]);

  /* Context */
  // Value
  const ctxValue: React.ContextType<typeof LoggedUserContext> = useMemo(
    () => (!!session ? { ...session.user, axiosInstance } : null),
    [!!session, JSON.stringify(session?.user ?? {}), axiosInstance],
  );

  /* Render */
  return (
    <SessionProvider session={session}>
      <LoggedUserContext value={ctxValue}>{children}</LoggedUserContext>
    </SessionProvider>
  );
}
