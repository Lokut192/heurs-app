'use client';

import type { AxiosInstance } from 'axios';
import type { User } from 'next-auth';
import { createContext } from 'react';

import type { Roles } from '../enums/roles.enum';

export const LoggedUserContext = createContext<
  | (User & {
      axiosInstance: AxiosInstance;
      roles: Roles[];
      grants: string[];
      hasSomeGrants: (...grants: string[]) => boolean;
      hasEveryGrants: (...grants: string[]) => boolean;
    })
  | null
>(null);
