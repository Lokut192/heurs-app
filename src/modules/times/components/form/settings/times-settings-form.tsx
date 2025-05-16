'use client';

import { useForm } from '@tanstack/react-form';
import { useState } from 'react';

import ConfirmDeleteAllTimesDialog from '../../dialog/confirm/time/confirm-delete-all-times-dialog';

export type DeleteAllTimesFormProps = {};

function DeleteAllTimesForm(_props: DeleteAllTimesFormProps): React.ReactNode {
  /* States */
  const [showConfirmDeleteAllTimesDialog, setShowConfirmDeleteAllTimesDialog] =
    useState<boolean>(false);

  /* Form */
  const form = useForm({
    defaultValues: {},

    onSubmit() {
      // updateMeMutation.mutate(value);
      setShowConfirmDeleteAllTimesDialog(true);
    },
  });

  /* Render */
  return (
    <>
      <ConfirmDeleteAllTimesDialog
        open={showConfirmDeleteAllTimesDialog}
        onClose={setShowConfirmDeleteAllTimesDialog}
      />

      <div className="grid max-w-[96rem] grid-cols-1 gap-x-8 gap-y-10 pb-4 sm:pb-6 md:grid-cols-3 lg:pb-8">
        <div>
          <h2 className="text-base-content text-base/7 font-semibold">
            Delete times
          </h2>
          <p className="text-base-content/80 mt-1 text-sm/6">
            This action will delete all your times and cannot be undone.
          </p>
        </div>

        <form
          className="flex items-start md:col-span-2"
          onSubmit={(ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            form.handleSubmit();
          }}
        >
          <button type="submit" className="btn btn-error">
            Yes, delete my times
          </button>
        </form>
      </div>
    </>
  );
}

export default DeleteAllTimesForm as React.FC<DeleteAllTimesFormProps>;
