'use client';

import { SortTableButton } from '@/_shared/components/button/table/sort-table-btn';

import { useUsersTableCtx } from '../../hooks/useUsersTableCtx';

type UsersTableProps = {};

function UsersTable(_props: UsersTableProps) {
  /* Context */
  const { users, order, orderby, setOrder, setOrderby } = useUsersTableCtx();

  /* Render */
  return (
    <div className="overflow-x-auto">
      <table className="table-zebra table">
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
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="font-semibold">{user.id.toString()}</td>
              <td>{user.username}</td>
              <td>
                <a href={`mailto:${user.email}`} className="link">
                  {user.email}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersTable as React.FC<UsersTableProps>;
