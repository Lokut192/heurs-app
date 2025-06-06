'use client';

import { useMutation } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import { AxiosError, AxiosHeaders, HttpStatusCode } from 'axios';
import { ZodError } from 'zod/v4';

import type { UseSoftMutationOptions } from '@/_shared/types/query/options';
import { useLoggedUser } from '@/modules/auth/hooks/use-logged-user';

import {
  type ApiPostRequestMonthStatsReportPayload,
  apiPostRequestMonthStatsReportPayloadSchema,
} from '../../schemas/api/post-request-month-stats-report.schema';

type UseRequestMonthTimesStatsReportMutationData = AxiosResponse<void, any>;
type UseRequestMonthTimesStatsReportMutationError = AxiosError;
type UseRequestMonthTimesStatsReportMutationVariables =
  ApiPostRequestMonthStatsReportPayload;
type UseRequestMonthTimesStatsReportMutationContext = unknown;

export type UseRequestMonthTimesStatsReportProps = {
  mutationOptions?: UseSoftMutationOptions<
    UseRequestMonthTimesStatsReportMutationData,
    UseRequestMonthTimesStatsReportMutationError,
    UseRequestMonthTimesStatsReportMutationVariables,
    UseRequestMonthTimesStatsReportMutationContext
  >;
};

export const useRequestMonthTimesStatsReport = ({
  mutationOptions = {},
}: UseRequestMonthTimesStatsReportProps = {}) => {
  /* Logged user */
  const { axiosInstance: api } = useLoggedUser();

  /* Mutation */
  const mutation = useMutation<
    UseRequestMonthTimesStatsReportMutationData,
    UseRequestMonthTimesStatsReportMutationError,
    UseRequestMonthTimesStatsReportMutationVariables,
    UseRequestMonthTimesStatsReportMutationContext
  >({
    retry: false,
    gcTime: 0,

    ...mutationOptions,

    mutationKey: ['request-month-times-stats-report'],

    mutationFn: (variables) => {
      try {
        const parameters =
          apiPostRequestMonthStatsReportPayloadSchema.parse(variables);
        const url = new URL(`/me/emails/monthly-report`, api.defaults.baseURL);

        url.searchParams.set('month', parameters.month.toString());
        url.searchParams.set('year', parameters.year.toString());

        return api.post(url.href);
      } catch (error) {
        if (error instanceof ZodError) {
          throw new AxiosError(
            'Invalid month number or year',
            'Invalid month number or year',
            undefined,
            undefined,
            {
              config: {
                headers: new AxiosHeaders(api.defaults.headers),
              },
              data: error,
              status: HttpStatusCode.BadRequest,
              statusText: 'Bad request',
              headers: new AxiosHeaders(api.defaults.headers),
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
