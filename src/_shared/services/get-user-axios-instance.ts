import 'server-only';

import type { AxiosInstance } from 'axios';
import axios, { HttpStatusCode, isAxiosError } from 'axios';
import { redirect } from 'next/navigation';
import type { Session } from 'next-auth';

import { authOptions } from '@/modules/auth/modules/next-auth/auth.options';

import getAxiosInstance from './get-axios-instance';

export default async function getUserAxiosInstance(
  session?: Session | null,
): Promise<AxiosInstance | null> {
  if (!session) {
    // eslint-disable-next-line no-param-reassign
    session = await (await import('next-auth')).getServerSession(authOptions);
  }

  if (!session) {
    return null;
  }

  const baseInstance = await getAxiosInstance();

  const instance = axios.create({
    ...baseInstance.defaults,

    headers: {
      ...baseInstance.defaults.headers,

      common: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    },
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (isAxiosError(error) && !!error.response) {
        switch (error.response.status) {
          case HttpStatusCode.Unauthorized:
            redirect('/auth/sign-in');
            break;

          case HttpStatusCode.Forbidden:
            redirect('/dashboard');
            break;

          default:
            break;
        }
      }

      return Promise.reject(error);
    },
  );

  return instance;
}
