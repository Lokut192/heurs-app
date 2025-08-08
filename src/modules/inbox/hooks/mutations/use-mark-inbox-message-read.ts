'use client';

import { useMutation } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import { AxiosError, AxiosHeaders } from 'axios';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { z } from 'zod/v4';

import { idSchema } from '@/_shared/schemas/id.schema';
import type { UseSoftMutationOptions } from '@/_shared/types/query/options';
import { useLoggedUser } from '@/modules/auth/hooks/use-logged-user';

import type { ApiGetInboxMessage } from '../../schemas/inbox-message.schemas';

const UseMarkInboxMessageReadMutationVariablesSchema = z.object({
  messageId: idSchema,
});

type UseMarkInboxMessageReadMutationData = AxiosResponse<
  ApiGetInboxMessage,
  any
>;
type UseMarkInboxMessageReadMutationError = AxiosError;
type UseMarkInboxMessageReadMutationVariables = z.infer<
  typeof UseMarkInboxMessageReadMutationVariablesSchema
>;
type UseMarkInboxMessageReadMutationContext = unknown;

export type UseMarkInboxMessageReadProps = {
  mutationOptions?: UseSoftMutationOptions<
    UseMarkInboxMessageReadMutationData,
    UseMarkInboxMessageReadMutationError,
    UseMarkInboxMessageReadMutationVariables,
    UseMarkInboxMessageReadMutationContext
  >;
};

export const useMarkInboxMessageRead = ({
  mutationOptions = {},
}: UseMarkInboxMessageReadProps = {}) => {
  /* Logged user */
  const { axiosInstance: api } = useLoggedUser();

  const mutation = useMutation<
    UseMarkInboxMessageReadMutationData,
    UseMarkInboxMessageReadMutationError,
    UseMarkInboxMessageReadMutationVariables,
    UseMarkInboxMessageReadMutationContext
  >({
    gcTime: 0,

    retry: false,

    ...mutationOptions,

    mutationKey: ['mark-inbox-message-read'],

    async mutationFn(variables) {
      try {
        const payload =
          UseMarkInboxMessageReadMutationVariablesSchema.parse(variables);

        return api.post<ApiGetInboxMessage>(
          `/inbox/messages/${payload.messageId}/read`,
        );
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new AxiosError(
            `Request failed with status code 400`,
            `Request failed with status code 400`,
            undefined,
            undefined,
            {
              config: {
                headers: new AxiosHeaders(api.defaults.headers),
              },
              data: error,
              status: StatusCodes.BAD_REQUEST,
              statusText: ReasonPhrases.BAD_REQUEST,
              headers: api.defaults.headers,
            },
          );
        }

        throw error;
      }
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

  return mutation;
};
