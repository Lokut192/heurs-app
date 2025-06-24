'use client';

import { useMemo, useState } from 'react';

import { UsersTableContext } from '../contexts/users-table.ctx';
import { useUsersList } from '../hooks/queries/useUsersList';

type UsersTableProviderProps = {
  children?: React.ReactNode;
};

type UsersTableContextType = React.ContextType<typeof UsersTableContext>;

function UsersTableProvider({ children }: UsersTableProviderProps) {
  /* States */
  const [debouncedSearch, setDebouncedSearch] =
    useState<UsersTableContextType['debouncedSearch']>('');
  const [order, setOrder] = useState<UsersTableContextType['order']>('asc');
  const [orderby, setOrderby] =
    useState<UsersTableContextType['orderby']>('username');
  const [page, setPage] = useState<UsersTableContextType['page']>(1);
  const [limit, setLimit] = useState<UsersTableContextType['limit']>(25);

  /* Queries */
  const usersQuery = useUsersList({
    queryParams: {
      page: page.toString(),
      limit: limit.toString(),

      ...(debouncedSearch && debouncedSearch.trim().length > 0
        ? { search: debouncedSearch }
        : {}),

      ...(order ? { order } : {}),
      ...(orderby ? { orderby } : {}),
    },
  });

  /* Context value */
  const ctxValue: UsersTableContextType = useMemo(
    () => ({
      users: usersQuery.data ?? [],
      usersMetadata: usersQuery.data?.metadata ?? {
        page: 1,
        pageCount: 0,
        pageSize: 0,
        total: 0,
      },

      usersQuery,

      page,
      setPage,

      limit,
      setLimit,

      debouncedSearch,
      setDebouncedSearch,

      order,
      setOrder,

      orderby,
      setOrderby,
    }),
    [
      usersQuery.status,
      usersQuery.fetchStatus,
      usersQuery.dataUpdatedAt,

      limit,
      page,

      debouncedSearch,

      order,
      orderby,
    ],
  );

  /* Render */
  return (
    <>
      {process.env.NODE_ENV === 'development' && true && (
        <details>
          <summary>Users table provider</summary>

          <pre>
            <code>
              {JSON.stringify(
                { users: usersQuery.data, metadata: usersQuery.data.metadata },
                null,
                2,
              )}
            </code>
          </pre>
        </details>
      )}
      <UsersTableContext.Provider value={ctxValue}>
        {children}
      </UsersTableContext.Provider>
    </>
  );
}

export default UsersTableProvider as React.FC<UsersTableProviderProps>;
