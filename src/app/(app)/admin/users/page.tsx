import type { Metadata } from 'next';
import type { User } from 'next-auth';

import type { PageAccessConfig } from '@/modules/auth/types/page-access-config.type';
import UsersTablePagination from '@/modules/users/components/pagination/table/users-table-pagination';
import UsersTableSearch from '@/modules/users/components/search/users-table-search';
import UsersTableLimitSelect from '@/modules/users/components/select/limit/users-table-limit-select';
import UsersTable from '@/modules/users/components/table/users-table';
import UsersTableProvider from '@/modules/users/providers/users-table.prov';

// #region Access

export const pageAccess: PageAccessConfig = {
  grants: ['p_Role.SUPER_ADMIN', 'p_Role.ADMIN'],
  mode: 'any',
};

// #endregion Access

// #region Types

type AdminUsersIndexProps = {
  searchParams: Promise<Record<string, string>>;
};

// #endregion Types

// #region Metadata

export const generateMetadata = async (
  _props: AdminUsersIndexProps,
): Promise<Metadata> => {
  return {
    title: 'Users',
  };
};

// #endregion Metadata

export default async function AdminUsersIndex(
  _props: User,
): Promise<React.ReactNode> {
  return (
    <>
      <h1 className="text-5xl/9 font-bold">Users</h1>

      <p className="text-base-content/50 mt-3 text-base/6 font-medium">
        All app users
      </p>

      <div className="mt-10 flex flex-col gap-5">
        <UsersTableProvider>
          <div className="flex w-full items-center justify-between">
            <UsersTableSearch />
            <UsersTableLimitSelect />
          </div>

          <UsersTable />

          <div className="flex w-full flex-col items-center justify-center sm:flex-row sm:justify-between">
            <UsersTablePagination />

            <UsersTableLimitSelect />
          </div>
        </UsersTableProvider>
      </div>
    </>
  );
}
