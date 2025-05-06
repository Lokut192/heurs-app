import { useQuery } from '@tanstack/react-query';
import type { AxiosError, AxiosResponse } from 'axios';
import { useMemo, useRef } from 'react';

import { idSchema } from '@/_shared/schemas/id.schema';
import type { UseSoftQueryOptions } from '@/_shared/types/query/options';
import { useLoggedUser } from '@/modules/auth/hooks/use-logged-user';

import type { ApiGetTime } from '../../types/time';

export type UseTimeQueryFnData = AxiosResponse<ApiGetTime, any>;
export type UseTimeQueryError = AxiosError;
export type UseTimeQueryData = ApiGetTime | null;

export type UseTimeProps = {
  timeId: number | null;
  queryOptions?: UseSoftQueryOptions<
    UseTimeQueryFnData,
    UseTimeQueryError,
    UseTimeQueryData
  >;
};

export const useTime = ({ timeId, queryOptions = {} }: UseTimeProps) => {
  /* Refs */
  const abortCtrlRef = useRef<AbortController | null>(null);

  /* Logged user */
  const { axiosInstance } = useLoggedUser();

  /* Query */
  const query = useQuery<
    UseTimeQueryFnData,
    UseTimeQueryError,
    UseTimeQueryData
  >({
    initialData: undefined,
    placeholderData: undefined,
    staleTime: 0,
    gcTime: 0,
    retry: false,
    ...queryOptions,
    enabled:
      (Object.hasOwn(queryOptions, 'enabled') ? queryOptions.enabled : true) &&
      idSchema.safeParse(timeId).success,
    queryKey: [
      'time',
      timeId,
      axiosInstance.defaults.headers.common.Authorization,
    ],
    queryFn() {
      // Abort previous request
      if (abortCtrlRef.current instanceof AbortController) {
        abortCtrlRef.current.abort();
      }

      // Create new abort controller
      const controller = new AbortController();
      const signal = AbortSignal.any([controller.signal]);

      // Assign to ref
      abortCtrlRef.current = controller;

      // Make request
      return axiosInstance.get<ApiGetTime>(`/times/id/${timeId}`, {
        signal,
      });
    },
    select(response) {
      return response.data ?? null;
    },
  });

  /* Return query */
  return useMemo(
    () => ({ ...query, data: query.data ?? null }),
    [query.status, query.fetchStatus],
  );
};
