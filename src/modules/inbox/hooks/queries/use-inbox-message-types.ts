'use client';

import { useQuery } from '@tanstack/react-query';
import { type AxiosError, type AxiosResponse, HttpStatusCode } from 'axios';
import { useMemo } from 'react';

import type { UseSoftQueryOptions } from '@/_shared/types/query/options';
import { useLoggedUser } from '@/modules/auth/hooks/use-logged-user';

type UseInboxMessageTypesQueryFnData = AxiosResponse<string[], any>;
type UseInboxMessageTypesQueryError = AxiosError;
type UseInboxMessageTypesQueryData = string[] | undefined;

export type UseInboxMessageTypesProps = {
  queryOptions?: UseSoftQueryOptions<
    UseInboxMessageTypesQueryFnData,
    UseInboxMessageTypesQueryError,
    UseInboxMessageTypesQueryData
  >;
};

const defaultReturn: string[] = [];

export const useInboxMessageTypes = ({
  queryOptions = {},
}: UseInboxMessageTypesProps = {}) => {
  /* Logged user */
  const { axiosInstance: api } = useLoggedUser();

  /* Query */
  const query = useQuery<
    UseInboxMessageTypesQueryFnData,
    UseInboxMessageTypesQueryError,
    UseInboxMessageTypesQueryData
  >({
    initialData: undefined,
    placeholderData: undefined,

    gcTime: 0,
    staleTime: 0,

    retry: false,

    ...queryOptions,

    queryKey: ['inbox-message-types'],

    async queryFn({ signal }) {
      // Endpoint
      const endpointURL = new URL(
        '/inbox/messages/types',
        api.defaults.baseURL,
      );

      // Request
      return api.get<string[]>(endpointURL.href, { signal });
    },

    select(res) {
      if (res.status === HttpStatusCode.Ok && Array.isArray(res.data)) {
        return res.data;
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
