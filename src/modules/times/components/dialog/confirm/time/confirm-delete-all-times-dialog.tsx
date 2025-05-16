'use client';

import { faSpinnerThird, faTrashCan } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from '@tanstack/react-form';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import type { Id } from 'react-toastify';
import { toast } from 'react-toastify';

import { Dialog, DialogTitle } from '@/_shared/components/ui/dialog/dialog';
import { apiErrorSchema } from '@/_shared/schemas/api/api-error.schema';
import { useDeleteAllMyTimes } from '@/modules/times/hooks/mutations/use-delete-all-my-times';

export type ConfirmDeleteAllTimesDialogProps = {
  open?: boolean | undefined;
  onClose?: (value: boolean) => void | undefined;
  onConfirm?: () => void | undefined;
};

function ConfirmDeleteAllTimesDialog({
  open = true,
  onClose = () => {},
}: ConfirmDeleteAllTimesDialogProps): React.ReactNode {
  /* States */
  const [toastId, setToastId] = useState<Id | null>(null);

  /* Form */
  const form = useForm({
    defaultValues: {},

    onSubmit() {
      deleteAllTimesMutation.mutate();
    },
  });

  /* Mutations */
  const deleteAllTimesMutation = useDeleteAllMyTimes({
    mutationOptions: {
      onMutate(_variables) {
        setToastId(toast.loading('Deleting times...'));
      },

      onSuccess(_data, _variables, _context) {
        form.reset();

        onClose(false);

        if (toastId) {
          toast.update(toastId, {
            render: 'Times deleted',
            type: 'success',
            isLoading: false,
            autoClose: 5000,
            closeOnClick: true,
            pauseOnHover: true,
          });
        }
      },

      onError(error, _variables, _context) {
        if (toastId) {
          toast.update(toastId, {
            render: 'Times could not be deleted',
            type: 'error',
            isLoading: false,
            autoClose: 5000,
            closeOnClick: true,
            pauseOnHover: true,
          });
        }

        if (isAxiosError(error)) {
          if (error.response) {
            const safeErrorData = apiErrorSchema.safeParse(error.response.data);

            if (!!safeErrorData.error) {
              toast.error('Internal server error');
              return;
            }
          }
        }
      },

      onSettled(_data, _error, _variables, _context) {
        setToastId(null);
      },
    },
  });

  /* Render */
  return (
    <Dialog
      open={open}
      onClose={(value) => {
        if (deleteAllTimesMutation.isPending) {
          return;
        }

        onClose(value);
      }}
    >
      <DialogTitle>Confirm deletion</DialogTitle>

      <p className="text-base-content/90 mt-3 text-base/6">
        This action cannot be undone. Are you sure you want to delete all of
        your times?
      </p>

      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="col-span-full mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            className="btn w-full sm:w-fit"
            onClick={() => {
              onClose(false);
            }}
            // disabled={deleteAllTimesMutation.isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-error w-full sm:w-fit"
            disabled={deleteAllTimesMutation.isPending}
          >
            {deleteAllTimesMutation.isPending ? (
              <FontAwesomeIcon
                icon={faSpinnerThird}
                className="fa-fw animate-spin"
              />
            ) : (
              <FontAwesomeIcon icon={faTrashCan} className="fa-fw" />
            )}
            I&apos;m sure
          </button>
        </div>
      </form>
    </Dialog>
  );
}

export default ConfirmDeleteAllTimesDialog as React.FC<ConfirmDeleteAllTimesDialogProps>;
