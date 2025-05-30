import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ZodError } from 'zod/v4';

import type {
  ApiGetUserSetting,
  ApiPutUserSetting,
} from '@/_shared/schemas/api/setting/user/api-user-setting.schema';
import { apiPutUserSetting } from '@/_shared/schemas/api/setting/user/api-user-setting.schema';
import type { UseSoftMutationOptions } from '@/_shared/types/query/options';
import { useLoggedUser } from '@/modules/auth/hooks/use-logged-user';

export type UseUpdateMyTimezoneMutationData = ApiGetUserSetting;
export type UseUpdateMyTimezoneMutationError = AxiosError | ZodError;
export type UseUpdateMyTimezoneMutationVariables = ApiPutUserSetting;
export type UseUpdateMyTimezoneMutationContext = unknown;

export type UseUpdateMyTimezoneProps = {
  mutationOptions?: UseSoftMutationOptions<
    UseUpdateMyTimezoneMutationData,
    UseUpdateMyTimezoneMutationError,
    UseUpdateMyTimezoneMutationVariables,
    UseUpdateMyTimezoneMutationContext
  >;
};

export const useUpdateMyTimezone = ({
  mutationOptions = {},
}: UseUpdateMyTimezoneProps = {}) => {
  /* Axios */
  const { axiosInstance: axios } = useLoggedUser();

  /* Mutation */
  const mutation = useMutation<
    UseUpdateMyTimezoneMutationData,
    UseUpdateMyTimezoneMutationError,
    UseUpdateMyTimezoneMutationVariables,
    UseUpdateMyTimezoneMutationContext
  >({
    gcTime: 0,
    retry: false,

    ...mutationOptions,

    mutationKey: ['update-my-timezone'],

    async mutationFn(payload) {
      const parsedPayload = apiPutUserSetting.safeParse(payload);

      if (!!parsedPayload.error) {
        throw parsedPayload.error;
      }

      const response = await axios.put<UseUpdateMyTimezoneMutationData>(
        `/me/settings/TIME_ZONE`,
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
