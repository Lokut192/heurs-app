import 'server-only';

import type { AxiosResponse } from 'axios';
import { AxiosError, AxiosHeaders, HttpStatusCode } from 'axios';
import type { Session } from 'next-auth';

import type { ApiGetMe } from '@/_shared/schemas/api/me/api-me.schema';

import getUserAxiosInstance from '../../get-user-axios-instance';

export default async function getMyPersonalInformations(
  session?: Session | null,
): Promise<AxiosResponse<ApiGetMe, any> | AxiosError> {
  const axios = await getUserAxiosInstance(session);

  if (!axios) {
    return new AxiosError(
      'Request failed with status code 401',
      'Request failed with status code 401',
      { headers: new AxiosHeaders({}) },
      undefined,
      {
        config: { headers: new AxiosHeaders({}) },
        headers: new AxiosHeaders({}),
        data: null,
        status: HttpStatusCode.Unauthorized,
        statusText: 'Unauthorized',
      },
    );
  }

  try {
    return axios.get<ApiGetMe>('/me');
  } catch (error) {
    return error as AxiosError;
  }
}
