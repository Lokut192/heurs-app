import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { z, type ZodError } from 'zod/v4';

import type { ApiGetUserSetting } from '@/_shared/schemas/api/setting/user/api-user-setting.schema';
import { apiPutUserSetting } from '@/_shared/schemas/api/setting/user/api-user-setting.schema';
import type { UseSoftMutationOptions } from '@/_shared/types/query/options';
import { useLoggedUser } from '@/modules/auth/hooks/use-logged-user';

const updateMySettingPayload = apiPutUserSetting.extend({
  toastId: z.union([z.string(), z.number()]).optional(),
  code: z.string(),
});

type UpdateMySettingPayloadType = z.infer<typeof updateMySettingPayload>;

export type UseUpdateMySettingMutationData = ApiGetUserSetting;
export type UseUpdateMySettingMutationError = AxiosError | ZodError;
export type UseUpdateMySettingMutationVariables = UpdateMySettingPayloadType;
export type UseUpdateMySettingMutationContext = unknown;

export type UseUpdateMySettingProps = {
  mutationOptions?: UseSoftMutationOptions<
    UseUpdateMySettingMutationData,
    UseUpdateMySettingMutationError,
    UseUpdateMySettingMutationVariables,
    UseUpdateMySettingMutationContext
  >;
};

export const useUpdateMySetting = ({
  mutationOptions = {},
}: UseUpdateMySettingProps = {}) => {
  /* Axios */
  const { axiosInstance: axios } = useLoggedUser();

  /* Mutation */
  const mutation = useMutation<
    UseUpdateMySettingMutationData,
    UseUpdateMySettingMutationError,
    UseUpdateMySettingMutationVariables,
    UseUpdateMySettingMutationContext
  >({
    gcTime: 0,
    retry: false,

    ...mutationOptions,

    mutationKey: ['update-my-timezone'],

    async mutationFn(payload) {
      const parsedPayload = updateMySettingPayload.safeParse(payload);

      if (!!parsedPayload.error) {
        throw parsedPayload.error;
      }

      const { code, toastId: _toastId, ...data } = parsedPayload.data;

      const response = await axios.put<UseUpdateMySettingMutationData>(
        `/me/settings/${code}`,
        data,
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
