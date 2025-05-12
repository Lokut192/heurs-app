'use client';

import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import axios from 'axios';
import type { ZodError } from 'zod';

import type { UseSoftMutationOptions } from '@/_shared/types/query/options';

import type { ApiSignUpReturn } from '../../schemas/api-sign-up.schema';
import {
  type ApiSignUpPayload,
  apiSignUpPayloadSchema,
} from '../../schemas/api-sign-up.schema';

export type UseSignUpMutationData = ApiSignUpReturn;
export type UseSignUpMutationError = AxiosError | ZodError;
export type UseSignUpMutationVariables = ApiSignUpPayload;
export type UseSignUpMutationContext = unknown;

export type UseSignUpProps = {
  mutationOptions?: UseSoftMutationOptions<
    UseSignUpMutationData,
    UseSignUpMutationError,
    UseSignUpMutationVariables,
    UseSignUpMutationContext
  >;
};

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,

  timeout: 5000,
  timeoutErrorMessage: 'Request timed out',

  headers: {
    'x-timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
    'Content-Type': 'application/json',
  },

  responseType: 'json',
});

export const useSignUp = ({ mutationOptions = {} }: UseSignUpProps = {}) => {
  /* Mutation */
  const mutation = useMutation<
    UseSignUpMutationData,
    UseSignUpMutationError,
    UseSignUpMutationVariables,
    UseSignUpMutationContext
  >({
    gcTime: 0,
    retry: false,

    ...mutationOptions,

    mutationKey: ['sign-up'],

    async mutationFn(payload) {
      const parsedPayload = apiSignUpPayloadSchema.safeParse(payload);

      if (!!parsedPayload.error) {
        throw parsedPayload.error;
      }

      const response = await axiosInstance.post<UseSignUpMutationData>(
        `/auth/sign-up`,
        parsedPayload.data,
      );

      return response.data;
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
