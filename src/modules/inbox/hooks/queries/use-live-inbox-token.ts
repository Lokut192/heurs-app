'use client';

import { useQuery } from '@tanstack/react-query';
import { type AxiosError, type AxiosResponse, HttpStatusCode } from 'axios';
import { useMemo } from 'react';

import type { UseSoftQueryOptions } from '@/_shared/types/query/options';
import { useLoggedUser } from '@/modules/auth/hooks/use-logged-user';

type UseLiveInboxTokenQueryFnData = AxiosResponse<{ token: string }, any>;
type UseLiveInboxTokenQueryError = AxiosError;
type UseLiveInboxTokenQueryData = string | undefined;

export type UseLiveInboxTokenProps = {
  queryOptions?: UseSoftQueryOptions<
    UseLiveInboxTokenQueryFnData,
    UseLiveInboxTokenQueryError,
    UseLiveInboxTokenQueryData
  >;
};

export const useLiveInboxToken = ({
  queryOptions = {},
}: UseLiveInboxTokenProps = {}) => {
  /* Logged user */
  const { axiosInstance: api } = useLoggedUser();

  /* Query */
  const query = useQuery<
    UseLiveInboxTokenQueryFnData,
    UseLiveInboxTokenQueryError,
    UseLiveInboxTokenQueryData
  >({
    initialData: undefined,
    placeholderData: undefined,

    gcTime: 0,
    staleTime: 0,

    retry: false,

    ...queryOptions,

    queryKey: ['live-inbox-token'],

    async queryFn({ signal }) {
      // Endpoint
      const endpointURL = new URL('/inbox/live/token', api.defaults.baseURL);

      // Request
      return api.get<{ token: string }>(endpointURL.href, { signal });
    },

    select(res) {
      if (
        res.status === HttpStatusCode.Ok &&
        typeof res.data?.token === 'string'
      ) {
        return res.data.token;
      }

      return undefined;
    },
  });

  /* Return */
  return useMemo(
    () => ({ ...query, data: query.data ?? undefined }),
    [query.fetchStatus, query.status, query.dataUpdatedAt],
  );
};
