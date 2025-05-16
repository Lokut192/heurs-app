import { useMutation } from '@tanstack/react-query';
import type { AxiosError, AxiosResponse } from 'axios';
import type { ZodError } from 'zod';

import type { UseSoftMutationOptions } from '@/_shared/types/query/options';
import { useLoggedUser } from '@/modules/auth/hooks/use-logged-user';

export type UseDeleteAllMyTimesMutationData = AxiosResponse<void, any>;
export type UseDeleteAllMyTimesMutationError = AxiosError | ZodError;
export type UseDeleteAllMyTimesMutationVariables = void;
export type UseDeleteAllMyTimesMutationContext = unknown;

export type UseDeleteAllMyTimesProps = {
  mutationOptions?: UseSoftMutationOptions<
    UseDeleteAllMyTimesMutationData,
    UseDeleteAllMyTimesMutationError,
    UseDeleteAllMyTimesMutationVariables,
    UseDeleteAllMyTimesMutationContext
  >;
};

export const useDeleteAllMyTimes = ({
  mutationOptions = {},
}: UseDeleteAllMyTimesProps = {}) => {
  /* Axios */
  const { axiosInstance: axios } = useLoggedUser();

  /* Mutation */
  const mutation = useMutation<
    UseDeleteAllMyTimesMutationData,
    UseDeleteAllMyTimesMutationError,
    UseDeleteAllMyTimesMutationVariables,
    UseDeleteAllMyTimesMutationContext
  >({
    gcTime: 0,
    retry: false,

    ...mutationOptions,

    mutationKey: ['delete-all-times'],

    mutationFn(_payload) {
      return axios.delete<void>(`/times/all`);
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
