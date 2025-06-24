'use client';

import { useEffect, useState } from 'react';

import { useDebouncedStringValue } from '@/_shared/hooks/string/useDebouncedStringValue';

import { useUsersTableCtx } from '../../hooks/useUsersTableCtx';

type UsersTableSearchProps = {};

function UsersTableSearch(_props: UsersTableSearchProps): React.ReactNode {
  /* States */
  const [search, setSearch] = useState<string>('');

  /* Hooks */
  const localDebouncedSearch = useDebouncedStringValue(search, 300);

  /* Context */
  const { setDebouncedSearch } = useUsersTableCtx();

  /* Effects */
  useEffect(() => {
    setDebouncedSearch(localDebouncedSearch);
  }, [localDebouncedSearch]);

  /* Render */
  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">Search</legend>

      <label htmlFor="search" className="input">
        <input
          type="search"
          name="search"
          id="search"
          placeholder='Search user by "username" or "email"'
          className="min-w-60 placeholder:italic"
          value={search}
          onChange={(ev) => setSearch(ev.target.value)}
        />
      </label>
    </fieldset>
  );
}

export default UsersTableSearch as React.FC<UsersTableSearchProps>;
