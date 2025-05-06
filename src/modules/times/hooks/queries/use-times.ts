'use client';

import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { type AxiosResponse, HttpStatusCode } from 'axios';
import { useMemo, useRef } from 'react';

import type { UseSoftQueryOptions } from '@/_shared/types/query/options';
import { useUserAxiosInstance } from '@/modules/auth/hooks/use-user-axios-instance';

import type { ApiGetTime } from '../../types/time';

export type UseTimesQueryFnData = AxiosResponse<ApiGetTime[], any>;
export type UseTimesQueryError = AxiosError;
export type UseTimesQueryData = ApiGetTime[];

export type UseTimesProps = {
  queryParams?: Record<string, string>;
  queryOptions?: UseSoftQueryOptions<
    UseTimesQueryFnData,
    UseTimesQueryError,
    UseTimesQueryData
  >;
};

export const useTimes = ({
  queryParams = {},
  queryOptions = {},
}: UseTimesProps = {}) => {
  /* Refs */
  const abortCtrlRef = useRef<AbortController | null>(null);

  /* Logged user */
  // const { axiosInstance } = useLoggedUser();
  const axiosInstance = useUserAxiosInstance();

  /* Query */
  const query = useQuery<
    UseTimesQueryFnData,
    UseTimesQueryError,
    UseTimesQueryData
  >({
    placeholderData: undefined,
    initialData: undefined,
    staleTime: 0,
    gcTime: 0,
    retry: false,
    ...queryOptions,
    queryKey: [
      'times',
      JSON.stringify(queryParams),
      axiosInstance.defaults.headers.common.Authorization,
    ],
    async queryFn() {
      // await new Promise<void>((resolve) => {
      //   setTimeout(resolve, 5000);
      // });

      // throw new AxiosError(
      //   undefined,
      //   undefined,
      //   { headers: new AxiosHeaders(axiosInstance.defaults.headers) },
      //   undefined,
      //   {
      //     config: { headers: new AxiosHeaders(axiosInstance.defaults.headers) },
      //     headers: new AxiosHeaders(axiosInstance.defaults.headers),
      //     data: null,
      //     status: HttpStatusCode.BadRequest,
      //     statusText: 'Bad request',
      //   },
      // );

      // Abort previous request
      if (abortCtrlRef.current instanceof AbortController) {
        abortCtrlRef.current.abort();
      }

      const searchParams = new URLSearchParams(queryParams);

      for (const [key, value] of searchParams.entries()) {
        searchParams.set(key, value);
      }

      const pathname = `/times/list${searchParams.toString() ? `?${searchParams}` : ''}`;

      // Create new abort controller
      const controller = new AbortController();
      const signal = AbortSignal.any([controller.signal]);

      // Assign to ref
      abortCtrlRef.current = controller;

      return axiosInstance.get<ApiGetTime[]>(pathname, { signal });
    },
    select(response) {
      if (response.status === HttpStatusCode.Ok) {
        return response.data;
      }

      return [];
    },
  });

  /* Return */
  return useMemo(
    () => ({ ...query, data: query.data ?? [] }),
    [query.status, query.fetchStatus],
  );
};
