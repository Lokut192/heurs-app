'use client';

import { createContext } from 'react';

import type { ApiMetadata } from '@/_shared/types/api/metadata';

import type { useUsersList } from '../hooks/queries/useUsersList';
import type { ApiGetUser } from '../types/user';

export const UsersTableContext = createContext<{
  users: ApiGetUser[];
  usersMetadata: ApiMetadata;

  usersQuery: ReturnType<typeof useUsersList>;

  page: number;
  setPage: (page: number) => void;

  limit: number;
  setLimit: (limit: number) => void;

  debouncedSearch: string;
  setDebouncedSearch: (debouncedSearch: string) => void;

  order: 'asc' | 'desc' | null;
  setOrder: (order: 'asc' | 'desc' | null) => void;

  orderby: 'id' | 'username' | 'email' | null;
  setOrderby: (orderby: 'username' | 'email' | null) => void;
}>(null!);
