import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ZodError } from 'zod';

import {
  type ApiGetMe,
  type ApiPutMe,
  apiPutMeSchema,
} from '@/_shared/schemas/api/me/api-me.schema';
import type { UseSoftMutationOptions } from '@/_shared/types/query/options';
import { useLoggedUser } from '@/modules/auth/hooks/use-logged-user';

export type UseUpdateMeMutationData = ApiGetMe;
export type UseUpdateMeMutationError = AxiosError | ZodError;
export type UseUpdateMeMutationVariables = ApiPutMe;
export type UseUpdateMeMutationContext = unknown;

export type UseUpdateMeProps = {
  mutationOptions?: UseSoftMutationOptions<
    UseUpdateMeMutationData,
    UseUpdateMeMutationError,
    UseUpdateMeMutationVariables,
    UseUpdateMeMutationContext
  >;
};

export const useUpdateMe = ({
  mutationOptions = {},
}: UseUpdateMeProps = {}) => {
  /* Axios */
  const { axiosInstance: axios } = useLoggedUser();

  /* Mutation */
  const mutation = useMutation<
    UseUpdateMeMutationData,
    UseUpdateMeMutationError,
    UseUpdateMeMutationVariables,
    UseUpdateMeMutationContext
  >({
    gcTime: 0,
    retry: false,

    ...mutationOptions,

    mutationKey: ['update-me'],

    async mutationFn(payload) {
      const parsedPayload = apiPutMeSchema.safeParse(payload);

      if (!!parsedPayload.error) {
        throw parsedPayload.error;
      }

      const response = await axios.put<UseUpdateMeMutationData>(
        `/me`,
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
