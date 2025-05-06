import axios, { HttpStatusCode, isAxiosError } from 'axios';
import { useSession } from 'next-auth/react';

const useLoggedUser = () => {
  // Get session
  const { data: session } = useSession();

  // Check session
  if (session === null) {
    throw new Error('useLoggedUser must be used within a SessionProvider');
  }

  // Create axios instance
  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
      'x-timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    timeout: 5000,
    timeoutErrorMessage: 'Request timed out',
  });

  // Define axios response interceptors
  axiosInstance.interceptors.response.use(
    (response) => {
      return Promise.resolve(response);
    },
    async (error) => {
      if (isAxiosError(error)) {
        if (error.response) {
          switch (error.response.status) {
            case HttpStatusCode.Unauthorized:
              break;
            default:
              break;
          }
        }
      }
      return Promise.reject(error);
    },
  );

  // Return payload
  return { axiosInstance };
};

export { useLoggedUser };
