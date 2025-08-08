'use client';

import type { ComponentPropsWithoutRef } from 'react';
import Select from 'react-select';
import { twMerge } from 'tailwind-merge';

import { useInboxMessageTypes } from '@/modules/inbox/hooks/queries/use-inbox-message-types';

export const MessageTypeSelect: React.FC<
  Omit<ComponentPropsWithoutRef<'select'>, 'children'>
> = ({ ...props }) => {
  /* Queries */
  // Get Inbox Message Types
  const typesQuery = useInboxMessageTypes({ queryOptions: { enabled: true } });

  /* Render */
  // return (
  //   <select {...props} className={twMerge('', props.className ?? '')}>
  //     <option value="">-- SELECT --</option>

  //     {typesQuery.data.map((type) => (
  //       <option key={`inbox-message-type-${type}`} value={type}>
  //         {type}
  //       </option>
  //     ))}
  //   </select>
  // );
  return (
    <Select
      options={typesQuery.data.map((type) => ({
        value: type,
        label: type,
      }))}
      name="messageType"
      className={twMerge('', props.className ?? '')}
      isMulti={false}
      isClearable
      required
    />
  );
};
