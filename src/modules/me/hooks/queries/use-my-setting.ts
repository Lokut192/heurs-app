'use client';

import { useQuery } from '@tanstack/react-query';
import {
  AxiosError,
  AxiosHeaders,
  type AxiosResponse,
  HttpStatusCode,
} from 'axios';
import { useMemo } from 'react';
import { z, ZodError } from 'zod/v4';

import type { ApiGetUserSetting } from '@/_shared/schemas/api/setting/user/api-user-setting.schema';
import type { UseSoftQueryOptions } from '@/_shared/types/query/options';
import { useLoggedUser } from '@/modules/auth/hooks/use-logged-user';

type UseMySettingQueryFnData = AxiosResponse<ApiGetUserSetting, any>;
type UseMySettingQueryError = AxiosError;
type UseMySettingQueryData = ApiGetUserSetting | undefined;

export type UseMySettingProps = {
  settingCode: string | null | undefined;
  queryOptions?: UseSoftQueryOptions<
    UseMySettingQueryFnData,
    UseMySettingQueryError,
    UseMySettingQueryData
  >;
};

const settingCodeSchema = z.string().trim().nonempty();

export const useMySetting = ({
  settingCode,
  queryOptions = {},
}: UseMySettingProps) => {
  /* Logged user */
  const { axiosInstance: api } = useLoggedUser();

  /* Query */
  const query = useQuery<
    UseMySettingQueryFnData,
    UseMySettingQueryError,
    UseMySettingQueryData
  >({
    gcTime: 0,
    staleTime: 0,

    retry: false,

    initialData: undefined,
    placeholderData: undefined,

    ...queryOptions,

    enabled:
      (Object.hasOwn(queryOptions, 'enabled') ? queryOptions.enabled : true) &&
      settingCodeSchema.safeParse(settingCode).success,

    queryKey: ['my-setting'],

    async queryFn() {
      try {
        const setting = settingCodeSchema.parse(settingCode);

        return api.get<ApiGetUserSetting>(`/me/settings/${setting}`);
      } catch (error) {
        if (error instanceof ZodError) {
          throw new AxiosError(
            'Request failed with status code 400',
            'Request failed with status code 400',
            undefined,
            undefined,
            {
              config: { headers: new AxiosHeaders(api.defaults.headers) },
              data: error.issues,
              headers: new AxiosHeaders(api.defaults.headers),
              status: HttpStatusCode.BadRequest,
              statusText: 'Bad request',
            },
          );
        }

        throw error;
      }
    },

    select(response) {
      return response.data;
    },
  });

  /* Return */
  return useMemo(
    () => ({ ...query, data: query.data ?? null }),
    [query.fetchStatus, query.status, query.dataUpdatedAt],
  );
};
