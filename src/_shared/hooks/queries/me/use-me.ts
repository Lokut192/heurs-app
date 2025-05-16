import { useQuery } from '@tanstack/react-query';
import type { AxiosError, AxiosResponse } from 'axios';
import { useMemo } from 'react';

import type { ApiGetMe } from '@/_shared/schemas/api/me/api-me.schema';
import type { UseSoftQueryOptions } from '@/_shared/types/query/options';
import { useLoggedUser } from '@/modules/auth/hooks/use-logged-user';

export type UseMeQueryFnData = AxiosResponse<ApiGetMe, any>;
export type UseMeQueryError = AxiosError;
export type UseMeQueryData = ApiGetMe;

export type UseMeProps = {
  queryOptions?: UseSoftQueryOptions<
    UseMeQueryFnData,
    UseMeQueryError,
    UseMeQueryData
  >;
};

export const useMe = ({ queryOptions = {} }: UseMeProps = {}) => {
  /* Axios */
  const { axiosInstance: axios } = useLoggedUser();

  /* Query */
  const query = useQuery<UseMeQueryFnData, UseMeQueryError, UseMeQueryData>({
    retry: false,

    gcTime: 0,
    staleTime: 0,

    initialData: undefined,
    placeholderData: undefined,

    ...queryOptions,

    queryKey: ['me', axios.defaults.headers.common.Authorization],

    async queryFn() {
      return axios.get<ApiGetMe>('/me');
    },

    select(response) {
      return response.data;
    },
  });

  /* Return */
  return useMemo(
    () => ({ ...query, data: query.data ?? null }),
    [query.fetchStatus],
  );
};
