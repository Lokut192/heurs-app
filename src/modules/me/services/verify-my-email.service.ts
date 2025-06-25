import { type AxiosInstance } from 'axios';

export default async function verifyMyEmail(
  verifyEmailToken: string,
  api: AxiosInstance,
): Promise<void> {
  // await new Promise<void>((resolve) => {
  //   setTimeout(resolve, 5000);
  // });

  const endpoint = new URL('/email/verify', api.defaults.baseURL);

  endpoint.searchParams.set('token', verifyEmailToken);

  await api.get<void>(endpoint.href);

  return;
}
