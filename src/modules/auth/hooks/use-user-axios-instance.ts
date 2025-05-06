'use client';

import axios, { HttpStatusCode, isAxiosError } from 'axios';
import { signOut, useSession } from 'next-auth/react';
import { useMemo } from 'react';
import type z from 'zod';

import { apiRefreshTokenSchema } from '../schemas/api-refresh-token.schema';

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

export const useUserAxiosInstance = () => {
  /* User session */
  const { data: session, update: updateSession } = useSession();

  // Add elements to instance
  useMemo(() => {
    if (session?.user) {
      instance.defaults.headers.common.Authorization = `Bearer ${session.user.accessToken}`;

      instance.interceptors.response.use(
        (response) => {
          return Promise.resolve(response);
        },
        async (error) => {
          // console.error(error);
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
                    const refreshResponse = await axios.get<
                      z.infer<typeof apiRefreshTokenSchema>
                    >(`/auth/refresh`, {
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

                    updateSession({
                      accessToken: parsedRefreshTokenData.data.accessToken,
                    });
                    instance.defaults.headers.common.Authorization = `Bearer ${parsedRefreshTokenData.data.accessToken}`;

                    return instance(baseRequest);
                  } catch (refreshError) {
                    if (isAxiosError(refreshError) && refreshError.response) {
                      if (
                        error.response.status === HttpStatusCode.Unauthorized
                      ) {
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
    }
  }, [session?.user?.accessToken, session?.user?.refreshToken]);

  /* Return */
  return instance;
};
