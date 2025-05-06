import {
  useMutation,
  type UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError, AxiosHeaders, HttpStatusCode } from 'axios';

import { useLoggedUser } from '@/modules/auth/hooks/use-logged-user';

import {
  type ApiPostTime,
  apiPostTimeSchema,
} from '../../schemas/time/api-post-time.schema';
import type { ApiGetTime } from '../../types/time';

// #region types

export type UseCreateTimeMutationData = ApiGetTime;
export type UseCreateTimeMutationError = AxiosError;
export type UseCreateTimeMutationVariables = ApiPostTime;
export type UseCreateTimeMutationContext = unknown;

export type UseCreateTimeProps = {
  mutationOptions?: UseMutationOptions<
    UseCreateTimeMutationData,
    UseCreateTimeMutationError,
    UseCreateTimeMutationVariables,
    UseCreateTimeMutationContext
  >;
};

// #endregion types

export const useCreateTime = ({
  mutationOptions = {},
}: UseCreateTimeProps = {}) => {
  /* Logged user */
  const { axiosInstance } = useLoggedUser();

  /* Query client */
  const queryClient = useQueryClient();

  /* Mutation */
  const mutation = useMutation<
    UseCreateTimeMutationData,
    UseCreateTimeMutationError,
    UseCreateTimeMutationVariables,
    UseCreateTimeMutationContext
  >({
    retry: false,
    gcTime: 0,
    ...mutationOptions,
    mutationKey: [
      'create-time',
      axiosInstance.defaults.headers.common.Authorization,
    ],
    async mutationFn(variables) {
      const parsedPayload = apiPostTimeSchema.safeParse(variables);

      if (!!parsedPayload.error) {
        throw new AxiosError(
          undefined,
          undefined,
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

      const response = await axiosInstance.post<ApiGetTime>(
        '/plugins/times',
        parsedPayload.data,
      );

      return response.data;
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
