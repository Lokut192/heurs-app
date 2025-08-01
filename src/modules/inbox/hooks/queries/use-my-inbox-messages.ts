'use client';

import { useQuery } from '@tanstack/react-query';
import { type AxiosError, type AxiosResponse, HttpStatusCode } from 'axios';
import { useMemo } from 'react';

import type { UseSoftQueryOptions } from '@/_shared/types/query/options';
import { useLoggedUser } from '@/modules/auth/hooks/use-logged-user';

import type { ApiGetInboxMessage } from '../../schemas/inbox-message.schemas';

type UseMyInboxMessagesQueryFnData = AxiosResponse<ApiGetInboxMessage[], any>;
type UseMyInboxMessagesQueryError = AxiosError;
type UseMyInboxMessagesQueryData = ApiGetInboxMessage[] | undefined;

export type UseMyInboxMessagesProps = {
  queryOptions?: UseSoftQueryOptions<
    UseMyInboxMessagesQueryFnData,
    UseMyInboxMessagesQueryError,
    UseMyInboxMessagesQueryData
  >;
};

export const useMyInboxMessages = ({
  queryOptions = {},
}: UseMyInboxMessagesProps = {}) => {
  /* Logged user */
  const { axiosInstance: api } = useLoggedUser();

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

    queryKey: ['my-inbox-messages'],

    async queryFn({ signal }) {
      // Endpoint
      const endpointURL = new URL('/inbox/messages', api.defaults.baseURL);

      // Pagination
      endpointURL.searchParams.set('limit', '-1');
      endpointURL.searchParams.set('page', '1');

      // Ordering
      endpointURL.searchParams.set('order', 'desc');
      endpointURL.searchParams.set('orderby', 'sentAt');

      // Request
      return api.get<ApiGetInboxMessage[]>(endpointURL.href, { signal });
    },

    select(res) {
      if (res.status === HttpStatusCode.Ok && Array.isArray(res.data)) {
        return res.data;
      }

      return [];
    },
  });

  /* Return */
  return useMemo(
    () => ({ ...query, data: query.data ?? [] }),
    [query.fetchStatus, query.status, query.dataUpdatedAt],
  );
};
