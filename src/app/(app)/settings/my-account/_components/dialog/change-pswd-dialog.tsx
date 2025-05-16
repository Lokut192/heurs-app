'use client';

import {
  faCircleExclamation,
  faFloppyDisk,
  faSpinnerThird,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from '@tanstack/react-form';
import { HttpStatusCode, isAxiosError } from 'axios';
import { useState } from 'react';
import type { Id } from 'react-toastify';
import { toast } from 'react-toastify';
import { ZodError } from 'zod';

import { Dialog, DialogTitle } from '@/_shared/components/ui/dialog/dialog';
import { useUpdateMePassword } from '@/_shared/hooks/mutations/me/use-update-me-password';
import { apiErrorSchema } from '@/_shared/schemas/api/api-error.schema';
import { apiPasswordSchema } from '@/modules/auth/schemas/api-password.schema';

export type ChangePasswordDialogProps = {
  open?: boolean | undefined;
  onClose?: (value: boolean) => void | undefined;
};

function ChangePasswordDialog({
  open = true,
  onClose = () => {},
}: ChangePasswordDialogProps): React.ReactNode {
  /* States */
  const [toastId, setToastId] = useState<Id | null>(null);

  /* Form */
  const form = useForm({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },

    onSubmit({ value }) {
      updateMePasswordMutation.mutate(value);
    },
  });

  /* Mutations */
  const updateMePasswordMutation = useUpdateMePassword({
    mutationOptions: {
      onMutate(_variables) {
        setToastId(toast.loading('Updating password...'));
      },

      onSuccess(_data, _variables, _context) {
        form.reset();

        onClose(false);

        if (toastId) {
          toast.update(toastId, {
            render: 'Password updated',
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
            render: 'Password could not be updated',
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
              case HttpStatusCode.Forbidden:
                form.fieldInfo.oldPassword.instance?.setErrorMap({
                  onChange: ['Password do not match old password'],
                });
                break;
              case HttpStatusCode.BadRequest:
                form.fieldInfo.newPassword.instance?.setErrorMap({
                  onChange: ['New password is not strong enough'],
                });
                break;
              default:
                break;
            }
          }
        } else if (error instanceof ZodError) {
          for (const issue of error.issues) {
            for (const path of issue.path) {
              form.fieldInfo[
                path as 'oldPassword' | 'newPassword' | 'confirmPassword'
              ]?.instance?.setErrorMap({
                onChange: [issue.message],
              });
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
        if (updateMePasswordMutation.isPending) {
          return;
        }

        onClose(value);
      }}
    >
      <DialogTitle>Change password</DialogTitle>

      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div>
          <form.Field name="oldPassword">
            {(field) => (
              <div>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Old password</legend>

                  <label
                    htmlFor="oldPassword"
                    className="input input-neutral w-full"
                  >
                    <input
                      type="password"
                      placeholder="********"
                      name="oldPassword"
                      id="oldPassword"
                      className="w-full"
                      value={field.state.value}
                      onChange={(ev) => {
                        field.setValue(ev.target.value);
                      }}
                      required
                    />
                  </label>
                </fieldset>
                {!field.state.meta.isValid &&
                  field.state.meta.errors.map((err) => (
                    <div
                      className="text-error mt-1 flex items-start"
                      key={`err-${field.name}-${err}`}
                    >
                      <FontAwesomeIcon
                        icon={faCircleExclamation}
                        className="fa-lg fa-fw mr-1.5 pt-1"
                      />
                      <p className="text-base/6 font-semibold whitespace-break-spaces">
                        {err}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </form.Field>
          <form.Field
            name="newPassword"
            validators={{
              onChange: ({ value }) => {
                const parsed = apiPasswordSchema.safeParse(value);
                if (value.length > 0 && !!parsed.error) {
                  return parsed.error.issues?.[0]?.message;
                }

                return undefined;
              },
            }}
          >
            {(field) => (
              <div>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">New password</legend>

                  <label
                    htmlFor="newPassword"
                    className="input input-neutral w-full"
                  >
                    <input
                      type="password"
                      placeholder="********"
                      name="newPassword"
                      id="newPassword"
                      className="w-full"
                      value={field.state.value}
                      onChange={(ev) => {
                        field.setValue(ev.target.value);
                      }}
                      required
                    />
                  </label>
                </fieldset>
                {!field.state.meta.isValid &&
                  field.state.meta.errors.map((err) => (
                    <div
                      className="text-error mt-1 flex items-start"
                      key={`err-${field.name}-${err}`}
                    >
                      <FontAwesomeIcon
                        icon={faCircleExclamation}
                        className="fa-lg fa-fw mr-1.5 pt-1"
                      />
                      <p className="text-base/6 font-semibold whitespace-break-spaces">
                        {err}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </form.Field>
          <form.Field
            name="confirmPassword"
            validators={{
              onChangeListenTo: ['newPassword'],
              onChange: ({ value, fieldApi }) => {
                if (
                  value.length > 0 &&
                  value !== fieldApi.form.getFieldValue('newPassword')
                ) {
                  return 'Passwords do not match';
                }

                return undefined;
              },
            }}
          >
            {(field) => (
              <div>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Confirm password</legend>

                  <label
                    htmlFor="confirmPassword"
                    className="input input-neutral w-full"
                  >
                    <input
                      type="password"
                      placeholder="********"
                      name="confirmPassword"
                      id="confirmPassword"
                      className="w-full"
                      value={field.state.value}
                      onChange={(ev) => {
                        field.setValue(ev.target.value);
                      }}
                      required
                    />
                  </label>
                </fieldset>
                {!field.state.meta.isValid &&
                  field.state.meta.errors.map((err) => (
                    <div
                      className="text-error mt-1 flex items-start"
                      key={`err-${field.name}-${err}`}
                    >
                      <FontAwesomeIcon
                        icon={faCircleExclamation}
                        className="fa-lg fa-fw mr-1.5 pt-1"
                      />
                      <p className="text-base/6 font-semibold whitespace-break-spaces">
                        {err}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </form.Field>
        </div>

        <div className="col-span-full mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            className="btn w-full sm:w-fit"
            onClick={() => onClose?.(false)}
            disabled={updateMePasswordMutation.isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary w-full sm:w-fit"
            disabled={updateMePasswordMutation.isPending}
          >
            {updateMePasswordMutation.isPending ? (
              <FontAwesomeIcon
                icon={faSpinnerThird}
                className="fa-fw animate-spin"
              />
            ) : (
              <FontAwesomeIcon icon={faFloppyDisk} className="fa-fw" />
            )}
            Save
          </button>
        </div>
      </form>
    </Dialog>
  );
}

export default ChangePasswordDialog as React.FC<ChangePasswordDialogProps>;
