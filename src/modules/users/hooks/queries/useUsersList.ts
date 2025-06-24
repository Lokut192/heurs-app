'use client';

import { useQuery } from '@tanstack/react-query';
import type { AxiosError, AxiosResponse } from 'axios';
import { useMemo } from 'react';

import extractApiResponseMetadata from '@/_shared/lib/api/extractMetadata';
import type { ApiMetadata } from '@/_shared/types/api/metadata';
import type { UseSoftQueryOptions } from '@/_shared/types/query/options';
import { useLoggedUser } from '@/modules/auth/hooks/use-logged-user';

import type { ApiGetUser } from '../../types/user';

export type UseUsersListQueryFnData = AxiosResponse<ApiGetUser[], any>;
export type UseUsersListQueryError = AxiosError;
export type UseUsersListQueryData = ApiGetUser[] & { metadata: ApiMetadata };

export type UseUsersListProps = {
  queryParams?: Record<string, string>;
  queryOptions?: UseSoftQueryOptions<
    UseUsersListQueryFnData,
    UseUsersListQueryError,
    UseUsersListQueryData
  >;
};

export const useUsersList = ({
  queryParams = {},
  queryOptions = {},
}: UseUsersListProps = {}) => {
  /* Logged user */
  const { axiosInstance: api } = useLoggedUser();

  /* Search parameters */
  const searchParams = useMemo(() => {
    const sp = new URLSearchParams();

    for (const [key, value] of Object.entries(queryParams)) {
      sp.set(key, value);
    }

    return sp;
  }, [queryParams]);

  /* Query */
  const query = useQuery<
    UseUsersListQueryFnData,
    UseUsersListQueryError,
    UseUsersListQueryData
  >({
    gcTime: 0,
    staleTime: 0,

    retry: false,

    initialData: undefined,
    placeholderData: undefined,

    ...queryOptions,

    queryKey: [
      'users',
      searchParams.toString(),
      api.defaults.headers.common.Authorization,
    ],

    async queryFn() {
      const url = new URL(`/users/list`, api.defaults.baseURL);

      url.search = searchParams.toString();

      return api.get<ApiGetUser[]>(url.href);
    },

    select(response) {
      const metadata = extractApiResponseMetadata(response);

      return Object.assign(response.data, { metadata });
    },
  });

  return useMemo(
    () => ({
      ...query,
      data:
        query.data ??
        Object.assign([], {
          metadata: {
            page: 1,
            pageCount: 0,
            pageSize: 0,
            total: 0,
          },
        }),
    }),
    [query.status, query.fetchStatus, query.dataUpdatedAt],
  );
};
