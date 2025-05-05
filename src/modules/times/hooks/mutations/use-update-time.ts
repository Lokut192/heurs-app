import {
  useMutation,
  type UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError, AxiosHeaders, HttpStatusCode } from 'axios';

import { useLoggedUser } from '@/modules/auth/hooks/use-logged-user';

import type { ApiPutTime } from '../../schemas/time/api-put-time.schema';
import { apiPutTimeSchema } from '../../schemas/time/api-put-time.schema';
import type { ApiGetTime } from '../../types/time';

// #region types

export type UseUpdateTimeMutationData = ApiGetTime;
export type UseUpdateTimeMutationError = AxiosError;
export type UseUpdateTimeMutationVariables = ApiPutTime;
export type UseUpdateTimeMutationContext = unknown;

export type UseUpdateTimeProps = {
  mutationOptions?: UseMutationOptions<
    UseUpdateTimeMutationData,
    UseUpdateTimeMutationError,
    UseUpdateTimeMutationVariables,
    UseUpdateTimeMutationContext
  >;
};

// #endregion types

export const useUpdateTime = ({
  mutationOptions = {},
}: UseUpdateTimeProps = {}) => {
  /* Logged user */
  const { axiosInstance } = useLoggedUser();

  /* Query client */
  const queryClient = useQueryClient();

  /* Mutation */
  const mutation = useMutation<
    UseUpdateTimeMutationData,
    UseUpdateTimeMutationError,
    UseUpdateTimeMutationVariables,
    UseUpdateTimeMutationContext
  >({
    retry: false,
    gcTime: 0,
    ...mutationOptions,
    mutationKey: [
      'update-time',
      axiosInstance.defaults.headers.common.Authorization,
    ],
    async mutationFn(variables) {
      const parsedPayload = apiPutTimeSchema.safeParse(variables);

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

      const response = await axiosInstance.put<ApiGetTime>(
        `/plugins/times/id/${parsedPayload.data.id}`,
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
