'use client';

import { faSpinnerThird, faTrashCan } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from '@tanstack/react-form';
import type { AxiosError } from 'axios';
import { DateTime, Duration } from 'luxon';
import { useEffect } from 'react';

import { Dialog, DialogTitle } from '@/_shared/components/ui/dialog/dialog';
import { useDeleteTime } from '@/modules/times/hooks/mutations/use-delete-time';
import { useTime } from '@/modules/times/hooks/queries/use-time';

export const DeleteTimeDialog: React.FC<{
  timeId: number | null;
  open?: boolean | undefined;
  onClose?: (value: boolean) => void | undefined;
  onDelete?: () => void | undefined;
  onDeleted?: () => void | undefined;
  onError?: (error: AxiosError) => void | undefined;
  onSettled?: () => void | undefined;
}> = ({ onClose, open, timeId, onError, onDelete, onDeleted, onSettled }) => {
  /* Queries */
  // Get time
  const { data: time, ...timeQuery } = useTime({
    timeId: timeId ?? null,
  });

  /* Mutations */
  // Delete time
  const deleteTimeMutation = useDeleteTime({
    mutationOptions: {
      onSuccess(_response) {
        onDeleted?.();
        onClose?.(false);

        // Reset form after modal transition delay
        setTimeout(() => {
          form.reset();
        }, 300);
      },
      onSettled() {
        onSettled?.();
      },
      onError(error) {
        onError?.(error);
      },
      onMutate() {
        onDelete?.();
      },
    },
  });

  /* Form */
  const form = useForm({
    defaultValues: {
      duration: 60,
      type: 'OVERTIME',
      date: DateTime.now().startOf('month').toISODate()!,
    },
    onSubmit(_props) {
      if (timeId) {
        deleteTimeMutation.mutate({ timeId });
      }
    },
  });

  /* Effects */
  // Define values from given time
  useEffect(() => {
    if (timeId && timeQuery.isSuccess && !!time) {
      // form.reset();
      form.setFieldValue('duration', time.duration);
      form.setFieldValue('type', time.type);
      form.setFieldValue('date', time.date);
    }
  }, [timeQuery.fetchStatus, timeId]);

  /* Render */
  return (
    <Dialog
      open={open ?? true}
      onClose={(value) => {
        if (deleteTimeMutation.isPending) {
          return;
        }
        onClose?.(value);
      }}
      className="sm:max-w-3xl"
    >
      <DialogTitle>{timeId ? 'Edit' : 'Create'} time</DialogTitle>

      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          form.handleSubmit();
        }}
        className="grid grid-cols-1 gap-2 sm:grid-cols-6"
      >
        {timeQuery.isSuccess && !!time && (
          <p className="col-span-full w-full text-base/6 font-medium">
            Are you sure you want to delete this{' '}
            <span className="font-bold italic">
              {Duration.fromObject({ minutes: time.duration })
                .shiftTo('hours', 'minutes')
                .toFormat("h'h' mm'm'")}
            </span>{' '}
            time slot from{' '}
            <span className="font-bold italic">
              {DateTime.fromISO(time.date).toLocaleString()}
            </span>
            ?
          </p>
        )}

        <div className="col-span-full mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            className="btn w-full sm:w-fit"
            onClick={() => onClose?.(false)}
            disabled={deleteTimeMutation.isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-error w-full sm:w-fit"
            disabled={deleteTimeMutation.isPending || !timeId}
          >
            {deleteTimeMutation.isPending ? (
              <FontAwesomeIcon
                icon={faSpinnerThird}
                className="fa-fw animate-spin"
              />
            ) : (
              <FontAwesomeIcon icon={faTrashCan} className="fa-fw" />
            )}
            Yes, delete
          </button>
        </div>
      </form>
    </Dialog>
  );
};
