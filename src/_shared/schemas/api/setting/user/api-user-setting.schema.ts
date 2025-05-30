import { z } from 'zod/v4';

export enum ApiUserSettingTypes {
  Text = 'TEXT',
  TimeZoneName = 'TIME_ZONE_NAME',
  Number = 'NUMBER',
  Boolean = 'BOOLEAN',
}

export const apiPutUserSetting = z.object({
  value: z.string(),
});

export const apiGetUserSetting = apiPutUserSetting.extend({
  id: z.number().positive(),
  code: z.string(),
  type: z.enum(ApiUserSettingTypes),
  createdAt: z.string(),
  updatedAt: z.string().nullable(),
});

export type ApiPutUserSetting = z.infer<typeof apiPutUserSetting>;
export type ApiGetUserSetting = z.infer<typeof apiGetUserSetting>;
