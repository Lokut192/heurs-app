'use client';

import { faCircleXmark as faCircleXmarkLight } from '@fortawesome/pro-light-svg-icons';
import {
  faCircleCheck,
  faCircleXmark,
  faSpinnerThird,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { z } from 'zod/v4';

import { SortTableButton } from '@/_shared/components/button/table/sort-table-btn';

import { useUsersTableCtx } from '../../hooks/useUsersTableCtx';

type UsersTableProps = {};

const userRowStrIdDatasetSchema = z.coerce.number().positive();
const userRowUsernameDatasetSchema = z.string().trim().nonempty();
const userRowActionSchema = z.enum(['see-user']);

function UsersTable(_props: UsersTableProps) {
  /* Routing */
  const router = useRouter();

  /* Callbacks */
  const handleRowClick: React.MouseEventHandler<HTMLTableSectionElement> =
    useCallback((ev) => {
      const target = (ev.target as HTMLElement).closest(
        'tr[data-action]',
      ) as HTMLTableRowElement | null;

      if (!target) {
        return;
      }

      const userId = userRowStrIdDatasetSchema.safeParse(target.dataset.userId);
      const userUsername = userRowUsernameDatasetSchema.safeParse(
        target.dataset.username,
      );
      const rowAction = userRowActionSchema.safeParse(target.dataset.action);

      if (!userId.success || !rowAction.success) {
        return;
      }

      switch (rowAction.data) {
        case 'see-user':
          if (userUsername.success) {
            router.push(
              `/settings/users/${encodeURIComponent(userUsername.data)}`,
            );
          }
          break;
        default:
          break;
      }
    }, []);

  /* Context */
  const { users, order, orderby, setOrder, setOrderby, usersQuery } =
    useUsersTableCtx();

  /* Render */
  return (
    <>
      {/* Alert feedback on error */}
      {usersQuery.isError && (
        <div role="alert" className="alert alert-error">
          <FontAwesomeIcon icon={faCircleXmarkLight} className="fa-fw fa-lg" />
          {usersQuery.error.message}
        </div>
      )}

      {/* Table */}
      {(usersQuery.isSuccess || usersQuery.isPending) && (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>
                  Id
                  <SortTableButton
                    propName="id"
                    order={order}
                    orderby={orderby}
                    onChangeOrder={({ order, orderby }) => {
                      setOrder(order);

                      // @ts-expect-error
                      setOrderby(orderby);
                    }}
                  />
                </th>
                <th>
                  Username
                  <SortTableButton
                    propName="username"
                    order={order}
                    orderby={orderby}
                    onChangeOrder={({ order, orderby }) => {
                      setOrder(order);

                      // @ts-expect-error
                      setOrderby(orderby);
                    }}
                  />
                </th>
                <th>
                  Email
                  <SortTableButton
                    propName="email"
                    order={order}
                    orderby={orderby}
                    onChangeOrder={({ order, orderby }) => {
                      setOrder(order);

                      // @ts-expect-error
                      setOrderby(orderby);
                    }}
                  />
                </th>
                <th className="text-center">Email verified</th>
              </tr>
            </thead>

            <tbody onClick={handleRowClick}>
              {/* Loading spinner */}
              {usersQuery.isPending && (
                <tr>
                  <td colSpan={4}>
                    <div className="text-accent flex items-center justify-center gap-2 p-2">
                      <FontAwesomeIcon
                        icon={faSpinnerThird}
                        className="fa-fw fa-lg animate-spin"
                      />

                      <span className="text-lg/7 font-semibold italic">
                        Loading users...
                      </span>
                    </div>
                  </td>
                </tr>
              )}

              {/* Users */}
              {usersQuery.isSuccess &&
                !usersQuery.isPending &&
                users.map((user) => (
                  <tr
                    key={user.id}
                    data-user-id={user.id.toString()}
                    data-username={user.username}
                    data-action={`see-user`}
                    className="hover:bg-base-300 cursor-pointer"
                  >
                    <td className="font-semibold">{user.id.toString()}</td>
                    <td>{user.username}</td>
                    <td>
                      <a
                        href={`mailto:${user.email}`}
                        className="link"
                        onClick={(ev) => {
                          ev.stopPropagation();
                        }}
                      >
                        {user.email}
                      </a>
                    </td>
                    <td className="text-center">
                      <FontAwesomeIcon
                        icon={
                          user.isEmailVerified ? faCircleCheck : faCircleXmark
                        }
                        className='fa-fw fa-lg data-[verified="false"]:text-red-500 data-[verified="true"]:text-green-500'
                        data-verified={user.isEmailVerified ? 'true' : 'false'}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default UsersTable as React.FC<UsersTableProps>;
