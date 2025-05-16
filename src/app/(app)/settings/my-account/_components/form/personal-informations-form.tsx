'use client';

import {
  faCircleExclamation,
  faFloppyDisk,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from '@tanstack/react-form';
import { HttpStatusCode, isAxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { type Id, toast } from 'react-toastify';
import z, { ZodError } from 'zod';

import { useUpdateMe } from '@/_shared/hooks/mutations/me/use-update-me';
import { useMe } from '@/_shared/hooks/queries/me/use-me';
import { apiErrorSchema } from '@/_shared/schemas/api/api-error.schema';
import { apiUsernameSchema } from '@/modules/auth/schemas/api-username.schema';

import ChangePasswordDialog from '../dialog/change-pswd-dialog';

export type PersonalInformationsFormProps = {};

function PersonalInformationsForm(
  _props: PersonalInformationsFormProps,
): React.ReactNode {
  /* States */
  const [showChangePasswordModal, setShowChangePasswordModal] =
    useState<boolean>(false);
  const [toastId, setToastId] = useState<Id | null>(null);

  /* Form */
  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
    },

    onSubmit({ value }) {
      updateMeMutation.mutate(value);
    },
  });

  /* Mutations */
  const updateMeMutation = useUpdateMe({
    mutationOptions: {
      onMutate(_variables) {
        setToastId(toast.loading('Saving informations...'));
      },

      onSuccess(data, _variables, _context) {
        form.setFieldValue('username', data.username);
        form.setFieldValue('email', data.email);

        if (toastId) {
          toast.update(toastId, {
            render: 'Informations saved',
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
            render: error.message,
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
              toast.error('Something went wrong');
              return;
            }

            switch (error.response.status) {
              case HttpStatusCode.Conflict:
                if (safeErrorData.data.message.startsWith('Username')) {
                  form.fieldInfo.username.instance?.setErrorMap({
                    onChange: ['Username already in use'],
                  });
                }

                if (safeErrorData.data.message.startsWith('Email')) {
                  form.fieldInfo.email.instance?.setErrorMap({
                    onChange: ['Email already in use'],
                  });
                }
                break;
              default:
                break;
            }
          }
        } else if (error instanceof ZodError) {
          for (const issue of error.issues) {
            for (const path of issue.path) {
              form.fieldInfo[
                path as 'username' | 'email'
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

  /* Queries */
  const meQuery = useMe();

  /* Effects */
  // Update form with fresh data
  useEffect(() => {
    if (meQuery.isSuccess && !!meQuery.data) {
      form.setFieldValue('username', meQuery.data.username);
      form.setFieldValue('email', meQuery.data.email);
    }
  }, [meQuery.fetchStatus]);

  /* Render */
  return (
    <>
      <ChangePasswordDialog
        open={showChangePasswordModal}
        onClose={setShowChangePasswordModal}
      />

      <div className="grid max-w-[96rem] grid-cols-1 gap-x-8 gap-y-10 pb-4 sm:pb-6 md:grid-cols-3 lg:pb-8">
        <div>
          <h2 className="text-base-content text-base/7 font-semibold">
            Personal Information
          </h2>
          <p className="text-base-content/80 mt-1 text-sm/6">
            Use a permanent address where you can receive mail.
          </p>
        </div>

        <form
          className="md:col-span-2"
          onSubmit={(ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="grid w-full grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <form.Field
              name="username"
              validators={{
                onSubmit: ({ value }) => {
                  const parsed = apiUsernameSchema.safeParse(value);
                  if (!!parsed.error) {
                    return parsed.error.issues?.[0]?.message;
                  }

                  return undefined;
                },
              }}
            >
              {(field) => (
                <div className="sm:col-span-2">
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Username</legend>

                    <label htmlFor="username" className="input w-full">
                      <input
                        type="text"
                        name="username"
                        id="username"
                        className="w-full"
                        placeholder="john.doe"
                        value={field.state.value}
                        onChange={(ev) => field.handleChange(ev.target.value)}
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
              name="email"
              validators={{
                onSubmit: ({ value }) => {
                  if (value.length > 0 && !!z.email().safeParse(value).error) {
                    return 'Invalid email format';
                  }
                  return undefined;
                },
              }}
            >
              {(field) => (
                <div className="sm:col-span-4">
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Email</legend>

                    <label htmlFor="email" className="input w-full">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="w-full"
                        placeholder="john.doe"
                        value={field.state.value}
                        onChange={(ev) => field.handleChange(ev.target.value)}
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

            <div className="col-span-full flex items-center justify-end gap-2 sm:gap-4">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowChangePasswordModal(true);
                }}
              >
                Change password
              </button>
              <button type="submit" className="btn btn-primary">
                <FontAwesomeIcon icon={faFloppyDisk} className="fa-fw fa-md" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default PersonalInformationsForm as React.FC<PersonalInformationsFormProps>;
