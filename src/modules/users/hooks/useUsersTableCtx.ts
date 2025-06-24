'use client';

import { useContext } from 'react';

import { UsersTableContext } from '../contexts/users-table.ctx';

export const useUsersTableCtx = () => {
  const context = useContext(UsersTableContext);

  if (!context) {
    throw new Error(
      'useUsersTableCtx must be used within a UsersTableProvider',
    );
  }

  return context;
};
