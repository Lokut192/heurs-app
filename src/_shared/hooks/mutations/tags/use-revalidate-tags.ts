'use client';

import { useMutation } from '@tanstack/react-query';
import type { AxiosError, AxiosResponse } from 'axios';
import axios from 'axios';

import type { UseSoftMutationOptions } from '@/_shared/types/query/options';

export type UseRevalidateTagsMutationData = AxiosResponse<void, any>;
export type UseRevalidateTagsMutationError = AxiosError<
  { message: string; error?: string },
  any
>;
export type UseRevalidateTagsMutationVariables = string[];
export type UseRevalidateTagsMutationContext = unknown;

export type UseRevalidateTagsProps = {
  mutationOptions?: UseSoftMutationOptions<
    UseRevalidateTagsMutationData,
    UseRevalidateTagsMutationError,
    UseRevalidateTagsMutationVariables,
    UseRevalidateTagsMutationContext
  >;
};

const internalApi = axios.create({
  baseURL: new URL('/api', process.env.NEXT_PUBLIC_APP_URL).href,

  timeout: 5 * 1000,
  timeoutErrorMessage: 'Request timed out',

  headers: {
    common: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  },

  responseType: 'json',
});

export const useRevalidateTags = ({
  mutationOptions = {},
}: UseRevalidateTagsProps = {}) => {
  /* Mutation */
  const mutation = useMutation<
    UseRevalidateTagsMutationData,
    UseRevalidateTagsMutationError,
    UseRevalidateTagsMutationVariables,
    UseRevalidateTagsMutationContext
  >({
    retry: false,
    gcTime: 0,

    ...mutationOptions,

    mutationKey: ['revalidate-tags'],
    mutationFn(tags) {
      return internalApi.post<void>('/tags/revalidate', tags);
    },

    onMutate(variables) {
      mutationOptions?.onMutate?.(variables);
    },

    onSuccess(data, variables, context) {
      mutationOptions?.onSuccess?.(data, variables, context);
    },

    onError(error, variables, context) {
      mutationOptions?.onError?.(error, variables, context);
    },

    onSettled(data, error, variables, context) {
      mutationOptions?.onSettled?.(data, error, variables, context);
    },
  });

  /* Return */
  return mutation;
};
