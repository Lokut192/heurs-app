'use client';

import {
  faCircleUser,
  faEnvelope,
  faLock,
} from '@fortawesome/pro-light-svg-icons';
import {
  faCheck,
  faCircleExclamation,
  faRightToBracket,
  faSpinnerThird,
  faUserPlus,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from '@tanstack/react-form';
import { HttpStatusCode, isAxiosError } from 'axios';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { twMerge } from 'tailwind-merge';
import z, { ZodError } from 'zod';

import { Dialog, DialogTitle } from '@/_shared/components/ui/dialog/dialog';
import { apiErrorSchema } from '@/_shared/schemas/api/api-error.schema';

import { useSignUp } from '../hooks/mutations/use-sign-up';
import { apiPasswordSchema } from '../schemas/api-password.schema';
import { apiUsernameSchema } from '../schemas/api-username.schmema';

// const getApiFieldError = (field: string, error: AxiosError | ZodError) => {
//   if (isAxiosError(error)) {
//   } else if (error instanceof ZodError) {
//   }
// };

const SignInButton: React.FC<{
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}> = ({ className = '', onClick }) => (
  <Link
    href={{
      pathname: '/auth/sign-in',
    }}
    className={twMerge('btn btn-secondary w-full', className)}
    onClick={(ev) => {
      onClick?.(ev);
    }}
  >
    <span>Sign in</span>
    <FontAwesomeIcon icon={faRightToBracket} className="ml-1" />
  </Link>
);

export default function SignUpForm(): React.ReactNode {
  /* States */
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);

  /* Form */
  // Define login form
  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit({ value, formApi: _formApi, meta: _meta }) {
      signUpMutation.mutate(value);
    },
  });

  /* Mutations */
  const signUpMutation = useSignUp({
    mutationOptions: {
      onError(error, _variables, _context) {
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
                  // form.setFieldMeta('username', (prev) => ({
                  //   ...prev,
                  //   errors: ['Username already in use'],
                  //   isValid: false,
                  // }));
                }

                if (safeErrorData.data.message.startsWith('Email')) {
                  form.fieldInfo.email.instance?.setErrorMap({
                    onChange: ['Email already in use'],
                  });
                  // form.setFieldMeta('email', (prev) => ({
                  //   ...prev,
                  //   errors: ['Email already in use'],
                  //   isValid: false,
                  // }));
                }
                break;
              default:
                break;
            }
          }
        } else if (error instanceof ZodError) {
          // console.error('Zod error:', error);
          for (const issue of error.issues) {
            for (const path of issue.path) {
              // @ts-ignore
              // form.setFieldMeta(path, (prev) => ({
              //   ...prev,
              //   errors: [issue.message],
              //   isValid: false,
              // }));

              form.fieldInfo[path]?.instance?.setErrorMap({
                onChange: [issue.message],
              });
            }
          }
        }
      },

      onSuccess(_data, _variables, _context) {
        form.reset();
        setShowSuccessDialog(true);
      },
    },
  });

  /* Render */
  return (
    <>
      {/* Success dialog */}
      <Dialog
        open={showSuccessDialog}
        onClose={() => {}}
        className="max-w-sm sm:max-w-sm"
      >
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-100">
          <FontAwesomeIcon
            icon={faCheck}
            className="fa-fw fa-xl text-green-600"
          />
        </div>

        <div className="mt-3 w-full text-center sm:mt-5">
          <DialogTitle className="text-center">Account created</DialogTitle>
        </div>

        <p className="text-base-content mt-2 text-center text-base/6 font-medium">
          Your account has been successfully created.
          <br />
          Now, you can log in.
        </p>

        <div className="mt-5 w-full">
          <SignInButton
            onClick={() => {
              setShowSuccessDialog(false);
            }}
          />
        </div>
      </Dialog>

      <div className="card card-border border-base-300 bg-base-100 w-md shadow">
        <div className="card-body">
          <h1 className="card-title">Sign up</h1>

          <div className="flex w-full flex-col">
            <form
              onSubmit={(ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                form.handleSubmit();
              }}
            >
              <div className="flex flex-col">
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
                    <>
                      <fieldset className="fieldset">
                        <legend className="fieldset-legend">Username</legend>
                        <label
                          htmlFor="username"
                          className="input input-neutral w-full"
                        >
                          <FontAwesomeIcon
                            icon={faCircleUser}
                            className="fa-fw fa-md"
                          />
                          <input
                            type="text"
                            name="username"
                            id="username"
                            placeholder="john or john.doe"
                            value={field.state.value}
                            onChange={(ev) =>
                              field.handleChange(ev.target.value)
                            }
                            className=""
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
                    </>
                  )}
                </form.Field>

                <form.Field
                  name="email"
                  validators={{
                    onSubmit: ({ value }) => {
                      if (
                        value.length > 0 &&
                        !!z.email().safeParse(value).error
                      ) {
                        return 'Invalid email format';
                      }
                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <>
                      <fieldset className="fieldset">
                        <legend className="fieldset-legend">Email</legend>
                        <label
                          htmlFor="email"
                          className="input input-neutral data-[errored]:input-error w-full"
                          {...(field.state.meta.isValid
                            ? {}
                            : { 'data-errored': true })}
                        >
                          <FontAwesomeIcon
                            icon={faEnvelope}
                            className="fa-fw fa-md"
                          />
                          <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="john or john.doe"
                            value={field.state.value}
                            onChange={(ev) =>
                              field.handleChange(ev.target.value)
                            }
                            className=""
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
                    </>
                  )}
                </form.Field>

                <form.Field
                  name="password"
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
                    <>
                      <fieldset className="fieldset">
                        <legend className="fieldset-legend">Password</legend>
                        <label
                          htmlFor="password"
                          className="input input-neutral w-full"
                        >
                          <FontAwesomeIcon
                            icon={faLock}
                            className="fa-fw fa-md"
                          />
                          <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="YouStr0ngPassw0rd$"
                            value={field.state.value}
                            onChange={(ev) =>
                              field.handleChange(ev.target.value)
                            }
                            className=""
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
                    </>
                  )}
                </form.Field>

                <form.Field
                  name="confirmPassword"
                  validators={{
                    onChangeListenTo: ['password'],
                    onChange: ({ value, fieldApi }) => {
                      if (
                        value.length > 0 &&
                        value !== fieldApi.form.getFieldValue('password')
                      ) {
                        return 'Passwords do not match';
                      }

                      return undefined;
                    },
                  }}
                >
                  {(field) => (
                    <>
                      <fieldset className="fieldset">
                        <legend className="fieldset-legend">
                          Confirm password
                        </legend>
                        <label
                          htmlFor="confirmPassword"
                          className="input input-neutral w-full"
                        >
                          <FontAwesomeIcon
                            icon={faLock}
                            className="fa-fw fa-md"
                          />
                          <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            placeholder="YouStr0ngPassw0rd$"
                            value={field.state.value}
                            onChange={(ev) =>
                              field.handleChange(ev.target.value)
                            }
                            className=""
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
                    </>
                  )}
                </form.Field>
              </div>

              <div className="card-actions mt-5">
                <button type="submit" className="btn btn-primary w-full">
                  <span>Sign up</span>
                  {!signUpMutation.isPending ? (
                    <FontAwesomeIcon icon={faUserPlus} className="ml-1" />
                  ) : (
                    <FontAwesomeIcon
                      icon={faSpinnerThird}
                      className="ml-1 animate-spin"
                    />
                  )}
                </button>
              </div>
            </form>

            <div className="divider">OR</div>

            <div className="flex flex-col gap-2">
              <h2 className="text-base-content text-xl/9 font-bold">
                Already have an account?
              </h2>

              <SignInButton />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
