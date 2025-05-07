import { useQuery } from '@tanstack/react-query';
import {
  AxiosError,
  AxiosHeaders,
  type AxiosResponse,
  HttpStatusCode,
} from 'axios';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import z from 'zod';

import type { UseSoftQueryOptions } from '@/_shared/types/query/options';
import { useLoggedUser } from '@/modules/auth/hooks/use-logged-user';

import type { ApiYearStatistics } from '../../schemas/api/get-year-stats.schema';

export type UseYearStatsQueryFnData = AxiosResponse<ApiYearStatistics, any>;
export type UseYearStatsQueryError = AxiosError;
export type UseYearStatsQueryData = ApiYearStatistics;

export type UseYearStatsProps = {
  year: number | null;
  queryOptions?: UseSoftQueryOptions<
    UseYearStatsQueryFnData,
    UseYearStatsQueryError,
    UseYearStatsQueryData
  >;
};

const getDefaultReturn: (year: number) => ApiYearStatistics = (year) => ({
  year,
  overtimeTimesCount: 0,
  overtimeTotalDuration: 0,
  recoveryTimesCount: 0,
  recoveryTotalDuration: 0,
  timesCount: 0,
  totalDuration: 0,
  balance: 0,
  weekAvgDuration: 0,
  monthAvgDuration: 0,
  updatedAt: DateTime.now().toISO(),
});

const yearSchema = z.number().min(2000);

export const useYearStats = ({
  year,
  queryOptions = {},
}: UseYearStatsProps) => {
  // Logged user
  const { axiosInstance } = useLoggedUser();

  // Check year validity
  const yearIsValid = useMemo(() => {
    return yearSchema.safeParse(year).success;
  }, [year]);

  // Query
  const query = useQuery<
    UseYearStatsQueryFnData,
    UseYearStatsQueryError,
    UseYearStatsQueryData
  >({
    retry: false,
    initialData: undefined,
    placeholderData: undefined,
    staleTime: 0,
    gcTime: 0,
    ...queryOptions,
    enabled:
      (Object.hasOwn(queryOptions, 'enabled') ? queryOptions.enabled : true) &&
      yearIsValid,
    queryKey: [
      'times-stats',
      'year',
      year,
      axiosInstance.defaults.headers.common.Authorization,
    ],
    queryFn() {
      // Check year
      const parsedYear = yearSchema.safeParse(year);

      if (!!parsedYear.error) {
        throw new AxiosError(
          'Invalid month number or year',
          'Invalid month number or year',
          { headers: new AxiosHeaders(axiosInstance.defaults.headers) },
          undefined,
          {
            config: {
              headers: new AxiosHeaders(axiosInstance.defaults.headers),
            },
            data: parsedYear.error,
            status: HttpStatusCode.BadRequest,
            statusText: 'Bad request',
            headers: new AxiosHeaders(axiosInstance.defaults.headers),
          },
        );
      }

      return axiosInstance.get<ApiYearStatistics>(
        `/times/statistics/for/year/${parsedYear.data}`,
      );
    },
    select(response) {
      return response.data ?? getDefaultReturn(year ?? DateTime.now().year);
    },
  });

  // Return
  return useMemo(
    () => ({
      ...query,
      data: query.data ?? getDefaultReturn(year ?? DateTime.now().year),
    }),
    [query.fetchStatus],
  );
};
