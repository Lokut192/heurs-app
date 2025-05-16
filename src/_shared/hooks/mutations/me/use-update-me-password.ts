import { useMutation } from '@tanstack/react-query';
import type { AxiosError, AxiosResponse } from 'axios';
import type { ZodError } from 'zod';

import {
  apiPutMePasswordSchema,
  type ApPutMePassword,
} from '@/_shared/schemas/api/me/api-me.schema';
import type { UseSoftMutationOptions } from '@/_shared/types/query/options';
import { useLoggedUser } from '@/modules/auth/hooks/use-logged-user';

export type UseUpdateMePasswordMutationData = AxiosResponse<void, any>;
export type UseUpdateMePasswordMutationError = AxiosError | ZodError;
export type UseUpdateMePasswordMutationVariables = ApPutMePassword;
export type UseUpdateMePasswordMutationContext = unknown;

export type UseUpdateMePasswordProps = {
  mutationOptions?: UseSoftMutationOptions<
    UseUpdateMePasswordMutationData,
    UseUpdateMePasswordMutationError,
    UseUpdateMePasswordMutationVariables,
    UseUpdateMePasswordMutationContext
  >;
};

export const useUpdateMePassword = ({
  mutationOptions = {},
}: UseUpdateMePasswordProps = {}) => {
  /* Axios */
  const { axiosInstance: axios } = useLoggedUser();

  /* Mutation */
  const mutation = useMutation<
    UseUpdateMePasswordMutationData,
    UseUpdateMePasswordMutationError,
    UseUpdateMePasswordMutationVariables,
    UseUpdateMePasswordMutationContext
  >({
    gcTime: 0,
    retry: false,

    ...mutationOptions,

    mutationKey: ['update-me-password'],

    async mutationFn(payload) {
      const parsedPayload = apiPutMePasswordSchema.safeParse(payload);

      if (!!parsedPayload.error) {
        throw parsedPayload.error;
      }

      const response = await axios.put<void>(
        `/me/password`,
        parsedPayload.data,
      );

      return response;
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
