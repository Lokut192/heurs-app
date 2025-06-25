import { useMutation } from '@tanstack/react-query';
import type { AxiosError, AxiosResponse } from 'axios';

import type { UseSoftMutationOptions } from '@/_shared/types/query/options';
import { useLoggedUser } from '@/modules/auth/hooks/use-logged-user';

export type UseSendVerificationEmailMutationData = AxiosResponse<void, any>;
export type UseSendVerificationEmailMutationError = AxiosError;
export type UseSendVerificationEmailMutationVariables = void;
export type UseSendVerificationEmailMutationContext = unknown;

export type UseSendVerificationEmailProps = {
  mutationOptions?: UseSoftMutationOptions<
    UseSendVerificationEmailMutationData,
    UseSendVerificationEmailMutationError,
    UseSendVerificationEmailMutationVariables,
    UseSendVerificationEmailMutationContext
  >;
};

export const useSendVerificationEmail = ({
  mutationOptions = {},
}: UseSendVerificationEmailProps = {}) => {
  /* Axios */
  const { axiosInstance: axios } = useLoggedUser();

  /* Mutation */
  const mutation = useMutation<
    UseSendVerificationEmailMutationData,
    UseSendVerificationEmailMutationError,
    UseSendVerificationEmailMutationVariables,
    UseSendVerificationEmailMutationContext
  >({
    gcTime: 0,
    retry: false,

    ...mutationOptions,

    mutationKey: ['send-email-verification'],

    async mutationFn() {
      // Construct callback URL
      const verificationUrlCallback = new URL(
        `/auth/verify-email`,
        process.env.NEXT_PUBLIC_APP_URL,
      );
      // verificationUrlCallback.searchParams.set('token', '{token}');
      verificationUrlCallback.search = 'token={token}';

      // Construct endpoint url
      const endpointUrl = new URL(
        `/me/emails/email-verification`,
        axios.defaults.baseURL,
      );
      endpointUrl.searchParams.set('callbackUrl', verificationUrlCallback.href);

      const response = await axios.post<void>(endpointUrl.href);

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
