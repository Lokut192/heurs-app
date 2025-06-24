'use client';

import TablePagination from '@/_shared/components/pagination/table/table-pagination';
import { useUsersTableCtx } from '@/modules/users/hooks/useUsersTableCtx';

function UsersTablePagination() {
  const { usersMetadata, page, setPage } = useUsersTableCtx();

  return (
    <TablePagination
      page={page}
      pageCount={usersMetadata.pageCount}
      pageSize={usersMetadata.pageSize}
      total={usersMetadata.total}
      setPage={setPage}
    />
  );
}

export default UsersTablePagination as React.FC;
