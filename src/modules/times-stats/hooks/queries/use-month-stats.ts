import { useQuery } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import { AxiosError, AxiosHeaders, HttpStatusCode } from 'axios';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import z from 'zod';

import type { UseSoftQueryOptions } from '@/_shared/types/query/options';
import { useLoggedUser } from '@/modules/auth/hooks/use-logged-user';

import type { ApiMonthStatistics } from '../../schemas/api/get-month-stats.schema';

// #region Types

export type UseMonthStatsQueryFnData = AxiosResponse<ApiMonthStatistics, any>;
export type UseMonthStatsQueryError = AxiosError;
export type UseMonthStatsQueryData = ApiMonthStatistics;

export type UseMonthStatsProps = {
  monthNumber?: number | undefined;
  year?: number | undefined;
  queryOptions?: UseSoftQueryOptions<
    UseMonthStatsQueryFnData,
    UseMonthStatsQueryError,
    UseMonthStatsQueryData
  >;
};

// #endregion Types

// #region Utilities

const monthNumberSchema = z.number().min(1).max(12);
const yearSchema = z.number().min(2000);

const getDefaultReturn = (month: number, year: number): ApiMonthStatistics => ({
  month,
  year,
  overtimeTimesCount: 0,
  overtimeTotalDuration: 0,
  timesCount: 0,
  totalDuration: 0,
  updatedAt: DateTime.now().toISO(),
});

// #endregion Utilities

export const useMonthStats = ({
  monthNumber,
  year,
  queryOptions = {},
}: UseMonthStatsProps) => {
  /* Logged user */
  const { axiosInstance } = useLoggedUser();

  /* Check month number */
  const monthNumberIsValid = useMemo(() => {
    return monthNumberSchema.safeParse(monthNumber).success;
  }, [monthNumber]);
  const yearIsValid = useMemo(() => {
    return yearSchema.safeParse(year).success;
  }, [year]);

  /* Query */
  const query = useQuery<
    UseMonthStatsQueryFnData,
    UseMonthStatsQueryError,
    UseMonthStatsQueryData
  >({
    retry: false,
    initialData: undefined,
    placeholderData: undefined,
    staleTime: 0,
    gcTime: 0,
    ...queryOptions,
    enabled:
      (Object.hasOwn(queryOptions, 'enabled') ? queryOptions.enabled : true) &&
      monthNumberIsValid &&
      yearIsValid,
    queryKey: [
      'month-stats',
      monthNumber,
      year,
      axiosInstance.defaults.headers.common.Authorization,
    ],
    async queryFn() {
      // Check month number and year
      const parsedMonthNumber = monthNumberSchema.safeParse(monthNumber);
      const parsedYear = yearSchema.safeParse(year);

      if (!!parsedMonthNumber.error || !!parsedYear.error) {
        throw new AxiosError(
          'Invalid month number or year',
          'Invalid month number or year',
          { headers: new AxiosHeaders(axiosInstance.defaults.headers) },
          undefined,
          {
            config: {
              headers: new AxiosHeaders(axiosInstance.defaults.headers),
            },
            data: {
              monthNumber: parsedMonthNumber.error,
              year: parsedYear.error,
            },
            status: HttpStatusCode.BadRequest,
            statusText: 'Bad request',
            headers: new AxiosHeaders(axiosInstance.defaults.headers),
          },
        );
      }

      // Get data
      const response = await axiosInstance.get<ApiMonthStatistics>(
        `/times/statistics/for/month/${parsedMonthNumber.data}/${parsedYear.data}`,
      );

      return response;
    },
    select(response) {
      return (
        response.data ??
        getDefaultReturn(
          monthNumber ?? DateTime.now().month,
          year ?? DateTime.now().year,
        )
      );
    },
  });

  return useMemo(
    () => ({
      ...query,
      data:
        query.data ??
        getDefaultReturn(
          monthNumber ?? DateTime.now().month,
          year ?? DateTime.now().year,
        ),
    }),
    [query.fetchStatus, query.status],
  );
};
