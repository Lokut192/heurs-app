import type { AxiosInstance } from 'axios';

export default async function getMyGrants(
  api: AxiosInstance,
): Promise<string[]> {
  const response = await api.get<string[]>('/me/grants');

  return response.data;
}
