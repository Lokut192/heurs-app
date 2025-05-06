'use client';

import { faCirclePlus, faPenToSquare } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { SaveTimeDialog } from '../../dialog/time/save-time-dialog';

export type SaveTimeButtonProps = React.ComponentPropsWithoutRef<'button'> & {
  timeId?: number | null | undefined;
};

export const SaveTimeButton: React.FC<SaveTimeButtonProps> = ({
  timeId,
  children,
  className,
  ...props
}) => {
  /* States */
  const [open, setOpen] = useState<boolean>(false);

  /* Render */
  return (
    <>
      <SaveTimeDialog
        timeId={timeId ?? undefined}
        open={open}
        onClose={setOpen}
      />
      <button
        type="button"
        {...props}
        onClick={(ev) => {
          props?.onClick?.(ev);
          setOpen(true);
        }}
        className={twMerge('', className ?? 'btn btn-primary')}
      >
        {children ?? (
          <>
            <FontAwesomeIcon icon={timeId ? faPenToSquare : faCirclePlus} />
            {timeId ? 'Edit entry' : 'Add an entry'}
          </>
        )}
      </button>
    </>
  );
};
