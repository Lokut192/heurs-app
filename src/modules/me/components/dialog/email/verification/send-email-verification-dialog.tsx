'use client';

import { faEnvelope, faSpinnerThird } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HttpStatusCode, isAxiosError } from 'axios';
import { useState } from 'react';
import type { Id } from 'react-toastify';
import { toast } from 'react-toastify';

import { Dialog, DialogTitle } from '@/_shared/components/ui/dialog/dialog';
import { apiErrorSchema } from '@/_shared/schemas/api/api-error.schema';
import { useSendVerificationEmail } from '@/modules/me/hooks/mutations/use-send-verification-email';

export type SendEmailVerificationDialogProps = {
  open?: boolean | undefined;
  onClose?: (value: boolean) => void | undefined;
};

function SendEmailVerificationDialog({
  open = true,
  onClose = () => {},
}: SendEmailVerificationDialogProps): React.ReactNode {
  /* States */
  const [toastId, setToastId] = useState<Id | null>(null);

  /* Mutations */
  const sendVerificationEmailMutation = useSendVerificationEmail({
    mutationOptions: {
      onMutate(_variables) {
        setToastId(toast.loading('Sending verification email...'));
      },

      onSuccess(_data, _variables, _context) {
        onClose(false);

        if (toastId) {
          toast.update(toastId, {
            render: 'Email sent',
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
            render: 'Could not send verification email',
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
            switch (error.response.status) {
              case HttpStatusCode.NotFound:
              case HttpStatusCode.BadRequest:
                toast.error(safeErrorData.data.message);
                break;
              default:
                break;
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
        if (sendVerificationEmailMutation.isPending) {
          return;
        }

        onClose(value);
      }}
    >
      <DialogTitle>Send verification email</DialogTitle>

      <p className="mt-1 text-base/6 font-medium text-gray-500">
        You will receive an email with a link to verify your email address.
        Please note that it may take a few minutes for the email to arrive.
      </p>

      <div className="col-span-full mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          className="btn w-full sm:w-fit"
          onClick={() => onClose?.(false)}
          disabled={sendVerificationEmailMutation.isPending}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary w-full sm:w-fit"
          disabled={sendVerificationEmailMutation.isPending}
          onClick={() => {
            sendVerificationEmailMutation.mutate();
          }}
        >
          {sendVerificationEmailMutation.isPending ? (
            <FontAwesomeIcon
              icon={faSpinnerThird}
              className="fa-fw animate-spin"
            />
          ) : (
            <FontAwesomeIcon icon={faEnvelope} className="fa-fw" />
          )}
          Send
        </button>
      </div>
    </Dialog>
  );
}

export default SendEmailVerificationDialog as React.FC<SendEmailVerificationDialogProps>;
