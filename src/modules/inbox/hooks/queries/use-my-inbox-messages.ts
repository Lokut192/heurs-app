'use client';

import { useQuery } from '@tanstack/react-query';
import { type AxiosError, type AxiosResponse, HttpStatusCode } from 'axios';
import { useMemo } from 'react';

import type { UseSoftQueryOptions } from '@/_shared/types/query/options';
import { useLoggedUser } from '@/modules/auth/hooks/use-logged-user';

import type { ApiGetInboxMessage } from '../../schemas/inbox-message.schemas';

type UseMyInboxMessagesQueryFnData = AxiosResponse<ApiGetInboxMessage[], any>;
type UseMyInboxMessagesQueryError = AxiosError;
type UseMyInboxMessagesQueryData =
  | (ApiGetInboxMessage[] & {
      dataUpdatedAt: number;
      total: number;
      page: number;
      pageSize: number;
      pageCount: number;
    })
  | undefined;

export type UseMyInboxMessagesProps = {
  queryParams?: Record<string, string | number>;
  queryOptions?: UseSoftQueryOptions<
    UseMyInboxMessagesQueryFnData,
    UseMyInboxMessagesQueryError,
    UseMyInboxMessagesQueryData
  >;
};

const defaultReturn = Object.assign([], {
  dataUpdatedAt: 0,
  total: 0,
  page: 1,
  pageSize: 0,
  pageCount: 1,
});

export const useMyInboxMessages = ({
  queryParams = {},
  queryOptions = {},
}: UseMyInboxMessagesProps = {}) => {
  /* Logged user */
  const { axiosInstance: api } = useLoggedUser();

  // Search parameters
  const searchParams = (() => {
    const sp = new URLSearchParams();

    for (const [key, value] of Object.entries(queryParams)) {
      sp.set(key, value.toString());
    }

    return sp;
  })();

  /* Query */
  const query = useQuery<
    UseMyInboxMessagesQueryFnData,
    UseMyInboxMessagesQueryError,
    UseMyInboxMessagesQueryData
  >({
    initialData: undefined,
    placeholderData: undefined,

    gcTime: 0,
    staleTime: 0,

    retry: false,

    ...queryOptions,

    queryKey: ['my-inbox-messages', searchParams.toString()],

    async queryFn({ signal }) {
      // Endpoint
      const endpointURL = new URL('/inbox/messages', api.defaults.baseURL);

      // Pagination
      endpointURL.searchParams.set('limit', '-1');
      endpointURL.searchParams.set('page', '1');

      // Ordering
      endpointURL.searchParams.set('order', 'desc');
      endpointURL.searchParams.set('orderby', 'sentAt');

      // Search
      for (const [key, value] of searchParams) {
        endpointURL.searchParams.set(key, value);
      }

      // Request
      return api.get<ApiGetInboxMessage[]>(endpointURL.href, { signal });
    },

    select(res) {
      if (res.status === HttpStatusCode.Ok && Array.isArray(res.data)) {
        return Object.assign(res.data, {
          dataUpdatedAt: Date.now(),
          total: res.headers['total'] ? Number(res.headers['total']) : 0,
          page: res.headers['page'] ? Number(res.headers['page']) : 1,
          pageSize: res.headers['pageSize']
            ? Number(res.headers['pageSize'])
            : 0,
          pageCount: res.headers['pageCount']
            ? Number(res.headers['pageCount'])
            : 1,
        });
      }

      return defaultReturn;
    },
  });

  /* Return */
  return useMemo(
    () => ({ ...query, data: query.data ?? defaultReturn }),
    [query.fetchStatus, query.status, query.dataUpdatedAt],
  );
};
