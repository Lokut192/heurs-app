import 'server-only';

import { type AxiosError } from 'axios';
import { getReasonPhrase, ReasonPhrases, StatusCodes } from 'http-status-codes';
import type { Session } from 'next-auth';

import type { ApiGetTimezone } from '@/_shared/schemas/api/timezone/api-timezone.schema';

import getUserAxiosInstance from '../../get-user-axios-instance';

export default async function gatAllTimezones(
  session?: Session | null,
): Promise<
  | {
      status: number;
      statusText: string;
      headers: Record<string, string>;
      data: ApiGetTimezone[];
      error?: undefined;
    }
  | {
      status: number;
      statusText: string;
      headers: Record<string, string>;
      data: null;
      error: { message: string };
    }
> {
  // await new Promise<void>((resolve) => {
  //   setTimeout(() => {
  //     resolve();
  //   }, 2000);
  // });
  const axios = await getUserAxiosInstance(session);

  if (!axios) {
    return {
      status: StatusCodes.UNAUTHORIZED,
      statusText: ReasonPhrases.UNAUTHORIZED,
      headers: {},
      data: null,
      error: { message: 'Request failed with status code 401' },
    };
  }

  try {
    const response = await axios.get<ApiGetTimezone[]>(
      `/timezone/list?orderby=name&order=ASC`,
    );

    return {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(Object.entries(response.headers)),
      data: response.data,
    };
  } catch (err) {
    const error = err as unknown as AxiosError;
    return {
      status: error.response?.status ?? StatusCodes.INTERNAL_SERVER_ERROR,
      statusText:
        error.response?.statusText ?? ReasonPhrases.INTERNAL_SERVER_ERROR,
      headers: Object.fromEntries(
        Object.entries(error.response?.headers ?? {}),
      ) as Record<string, string>,
      data: null,
      error: {
        message: getReasonPhrase(
          error.response?.status ?? StatusCodes.INTERNAL_SERVER_ERROR,
        ),
      },
    };
  }
}
