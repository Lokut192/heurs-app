import type { AxiosInstance } from 'axios';

import type { Roles } from '@/modules/auth/enums/roles.enum';

export default async function getMyRoles(api: AxiosInstance): Promise<Roles[]> {
  const response = await api.get<Roles[]>('/me/roles');

  return response.data;
}
