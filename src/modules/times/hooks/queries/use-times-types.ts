'use client';

import { useQuery } from '@tanstack/react-query';
import { type AxiosError, type AxiosResponse, HttpStatusCode } from 'axios';
import { useMemo } from 'react';

import type { UseSoftQueryOptions } from '@/_shared/types/query/options';
import { useLoggedUser } from '@/modules/auth/hooks/use-logged-user';

export type UseTimesTypesQueryFnData = AxiosResponse<string[], any>;
export type UseTimesTypesQueryError = AxiosError;
export type UseTimesTypesQueryData = string[];

export type UseTimesTypesProps = {
  queryOptions?: UseSoftQueryOptions<
    UseTimesTypesQueryFnData,
    UseTimesTypesQueryError,
    UseTimesTypesQueryData
  >;
};

export const useTimesTypes = ({
  queryOptions = {},
}: UseTimesTypesProps = {}) => {
  /* Logged user */
  const { axiosInstance } = useLoggedUser();

  /* Query */
  const query = useQuery<
    UseTimesTypesQueryFnData,
    UseTimesTypesQueryError,
    UseTimesTypesQueryData
  >({
    placeholderData: undefined,
    initialData: undefined,
    staleTime: 0,
    gcTime: 0,
    retry: false,
    ...queryOptions,
    queryKey: [
      'times-types',
      axiosInstance.defaults.headers.common.Authorization,
    ],
    queryFn() {
      return axiosInstance.get<string[]>(`/plugins/times/types`);
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
