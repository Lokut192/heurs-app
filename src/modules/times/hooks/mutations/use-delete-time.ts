import {
  useMutation,
  type UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import { AxiosError, AxiosHeaders, HttpStatusCode } from 'axios';
import z from 'zod';

import { idSchema } from '@/_shared/schemas/id.schema';
import { useLoggedUser } from '@/modules/auth/hooks/use-logged-user';

// #region types

export type UseDeleteTimeMutationData = AxiosResponse<void, any>;
export type UseDeleteTimeMutationError = AxiosError;
export type UseDeleteTimeMutationVariables = { timeId: number };
export type UseDeleteTimeMutationContext = unknown;

export type UseDeleteTimeProps = {
  mutationOptions?: UseMutationOptions<
    UseDeleteTimeMutationData,
    UseDeleteTimeMutationError,
    UseDeleteTimeMutationVariables,
    UseDeleteTimeMutationContext
  >;
};

// #endregion types

export const useDeleteTime = ({
  mutationOptions = {},
}: UseDeleteTimeProps = {}) => {
  /* Logged user */
  const { axiosInstance } = useLoggedUser();

  /* Query client */
  const queryClient = useQueryClient();

  /* Mutation */
  const mutation = useMutation<
    UseDeleteTimeMutationData,
    UseDeleteTimeMutationError,
    UseDeleteTimeMutationVariables,
    UseDeleteTimeMutationContext
  >({
    retry: false,
    gcTime: 0,
    ...mutationOptions,
    mutationKey: [
      'create-time',
      axiosInstance.defaults.headers.common.Authorization,
    ],
    async mutationFn(variables) {
      const parsedPayload = z.object({ timeId: idSchema }).safeParse(variables);

      if (!!parsedPayload.error) {
        throw new AxiosError(
          'Invalid time id',
          'Invalid time id',
          { headers: new AxiosHeaders(axiosInstance.defaults.headers) },
          undefined,
          {
            config: {
              headers: new AxiosHeaders(axiosInstance.defaults.headers),
            },
            data: parsedPayload.error,
            status: HttpStatusCode.BadRequest,
            statusText: 'Bad request',
            headers: axiosInstance.defaults.headers,
          },
        );
      }

      const response = await axiosInstance.delete<void>(
        `/plugins/times/id/${parsedPayload.data.timeId}`,
      );

      return response;
    },
    onMutate(variables) {
      mutationOptions?.onMutate?.(variables);
    },
    onSuccess(data, variables, context) {
      mutationOptions?.onSuccess?.(data, variables, context);

      queryClient?.invalidateQueries({ queryKey: ['times'], exact: false });
      // queryClient?.refetchQueries({ queryKey: ['times'], exact: false });
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
