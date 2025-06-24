'use client';

import { useUsersTableCtx } from '@/modules/users/hooks/useUsersTableCtx';

type UsersTableLimitSelectProps = {};

const choices = [10, 25, 50, 100];

function UsersTableLimitSelect(_props: UsersTableLimitSelectProps) {
  /* Context */
  const { limit, setLimit } = useUsersTableCtx();

  /* Render */
  return (
    <fieldset className="fieldset hidden sm:block">
      <legend className="fieldset-legend">Results per page</legend>

      <label htmlFor="users-table-limit" className="select">
        <select
          name="users-table-limit"
          id="users-table-limit"
          // className="select"
          value={limit.toString()}
          onChange={(ev) => {
            setLimit(Number(ev.target.value));
          }}
        >
          {choices.map((choice) => (
            <option key={`users-table-limit-${choice}`} value={choice}>
              {choice}
            </option>
          ))}
        </select>
      </label>
    </fieldset>
  );
}

export default UsersTableLimitSelect as React.FC<UsersTableLimitSelectProps>;
