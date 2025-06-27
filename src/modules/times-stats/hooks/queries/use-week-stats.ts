import { useQuery } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import { AxiosError, AxiosHeaders, HttpStatusCode } from 'axios';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { z } from 'zod/v4';

import type { UseSoftQueryOptions } from '@/_shared/types/query/options';
import { useLoggedUser } from '@/modules/auth/hooks/use-logged-user';

import type { ApiWeekStatistics } from '../../schemas/api/get-week-stats.schema';

// #region Types

export type UseWeekStatsQueryFnData = AxiosResponse<ApiWeekStatistics, any>;
export type UseWeekStatsQueryError = AxiosError;
export type UseWeekStatsQueryData = ApiWeekStatistics;

export type UseWeekStatsProps = {
  weekNumber?: number | undefined;
  year?: number | undefined;
  queryOptions?: UseSoftQueryOptions<
    UseWeekStatsQueryFnData,
    UseWeekStatsQueryError,
    UseWeekStatsQueryData
  >;
};

// #endregion Types

// #region Utilities

const weekNumberSchema = z.number().min(1).max(52);
const yearSchema = z.number().min(2000);

const getDefaultReturn = (
  weekNumber: number,
  year: number,
): ApiWeekStatistics => ({
  week: weekNumber,
  year,
  overtimeTimesCount: 0,
  overtimeTotalDuration: 0,
  recoveryTimesCount: 0,
  recoveryTotalDuration: 0,
  timesCount: 0,
  totalDuration: 0,
  balance: 0,
  updatedAt: DateTime.now().toISO(),
});

// #endregion Utilities

export const useWeekStats = ({
  weekNumber,
  year,
  queryOptions = {},
}: UseWeekStatsProps) => {
  /* Logged user */
  const { axiosInstance } = useLoggedUser();

  /* Check month number */
  const weekNumberIsValid = useMemo(() => {
    return weekNumberSchema.safeParse(weekNumber).success;
  }, [weekNumber]);
  const yearIsValid = useMemo(() => {
    return yearSchema.safeParse(year).success;
  }, [year]);

  /* Query */
  const query = useQuery<
    UseWeekStatsQueryFnData,
    UseWeekStatsQueryError,
    UseWeekStatsQueryData
  >({
    retry: false,
    initialData: undefined,
    placeholderData: undefined,
    staleTime: 0,
    gcTime: 0,
    ...queryOptions,
    enabled:
      (Object.hasOwn(queryOptions, 'enabled') ? queryOptions.enabled : true) &&
      weekNumberIsValid &&
      yearIsValid,
    queryKey: [
      'times-stats',
      'month',
      weekNumber,
      year,
      axiosInstance.defaults.headers.common.Authorization,
    ],
    async queryFn() {
      // Check month number and year
      const parsedWeekNumber = weekNumberSchema.safeParse(weekNumber);
      const parsedYear = yearSchema.safeParse(year);

      if (!!parsedWeekNumber.error || !!parsedYear.error) {
        throw new AxiosError(
          'Invalid week number or year',
          'Invalid week number or year',
          { headers: new AxiosHeaders(axiosInstance.defaults.headers) },
          undefined,
          {
            config: {
              headers: new AxiosHeaders(axiosInstance.defaults.headers),
            },
            data: {
              weekNumber: parsedWeekNumber.error,
              year: parsedYear.error,
            },
            status: HttpStatusCode.BadRequest,
            statusText: 'Bad request',
            headers: new AxiosHeaders(axiosInstance.defaults.headers),
          },
        );
      }

      // Get data
      const response = await axiosInstance.get<ApiWeekStatistics>(
        `/times/statistics/for/week/${parsedWeekNumber.data}/${parsedYear.data}`,
      );

      return response;
    },
    select(response) {
      return (
        response.data ??
        getDefaultReturn(
          weekNumber ?? DateTime.now().weekNumber,
          year ?? DateTime.now().weekYear,
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
          weekNumber ?? DateTime.now().weekNumber,
          year ?? DateTime.now().weekYear,
        ),
    }),
    [query.fetchStatus, query.status],
  );
};
