import type { AxiosInstance } from 'axios';
import type { User } from 'next-auth';
import { createContext } from 'react';

export const LoggedUserContext = createContext<
  (User & { axiosInstance: AxiosInstance }) | null
>(null);
