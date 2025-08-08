'use client';

import type { ComponentPropsWithoutRef } from 'react';
import Select from 'react-select';
import { twMerge } from 'tailwind-merge';

import { useUsersList } from '@/modules/users/hooks/queries/useUsersList';

export const UsersSelect: React.FC<
  Pick<ComponentPropsWithoutRef<'select'>, 'className'>
> = ({ ...props }) => {
  /* Queries */
  // Get Users
  const usersQuery = useUsersList({
    queryParams: {
      page: '1',
      limit: '-1',
    },
  });

  /* Render */
  return (
    <Select
      options={usersQuery.data.map((u) => ({
        value: u.id.toString(),
        label: `${u.username} <${u.email}>`,
      }))}
      name="users"
      className={twMerge('', props.className ?? '')}
      isMulti
      isClearable
      required
      closeMenuOnSelect={false}
    />
  );
};
