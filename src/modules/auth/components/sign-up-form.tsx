'use client';

import {
  faCircleUser,
  faEnvelope,
  faLock,
} from '@fortawesome/pro-light-svg-icons';
import {
  faCircleExclamation,
  faRightToBracket,
  faSpinnerThird,
  faUserPlus,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from '@tanstack/react-form';
import { HttpStatusCode, isAxiosError } from 'axios';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { ZodError } from 'zod';

import { apiErrorSchema } from '@/_shared/schemas/api/api-error.schema';

import { useSignUp } from '../hooks/mutations/use-sign-up';

export default function SignUpForm(): React.ReactNode {
  /* States */
  const [loading, setLoading] = useState<boolean>(false);

  /* Routing */
  const nextSearchParams = useSearchParams();

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
      let callbackUrl = '/dashboard';

      const searchParams = new URLSearchParams(nextSearchParams.toString());

      if (searchParams.has('callbackUrl')) {
        callbackUrl = searchParams.get('callbackUrl') as string;
      }

      signUpMutation.mutate(value);

      // setLoading(true);
      // signIn('credentials', { ...value, callbackUrl });
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
              // TODO: Toast unhandled exception
              return;
            }

            switch (error.response.status) {
              case HttpStatusCode.Conflict:
                if (safeErrorData.data.message.startsWith('Username')) {
                  // @ts-ignore
                  form.fieldInfo.username.instance?.setErrorMap({
                    onSubmit: ['Username already in use'],
                  });
                }

                if (safeErrorData.data.message.startsWith('Email')) {
                  form.fieldInfo.email.instance?.setErrorMap({
                    onSubmit: ['Email already in use'],
                  });
                  // @ts-ignore
                  // form.fieldInfo.email.instance?.setMeta({
                  //   errorMap: {
                  //     onSubmit: ['Email already in use'],
                  //   },
                  // });
                }
                break;
              default:
                break;
            }
          }
        } else if (error instanceof ZodError) {
          console.error('Zod error:', error);
          for (const issue of error.issues) {
            for (const path of issue.path) {
              // @ts-ignore
              form.setFieldMeta(path, { errors: [issue.message] });
            }
          }
        }
      },
    },
  });

  /* Render */
  return (
    <div className="card card-border border-base-300 bg-base-100 min-w-md shadow">
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
              <form.Field name="username">
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
                          onChange={(ev) => field.handleChange(ev.target.value)}
                          className=""
                          required
                        />
                      </label>
                    </fieldset>
                    {Array.isArray(field.state.meta.errorMap?.onSubmit) &&
                      (
                        field.state.meta.errorMap
                          .onSubmit as unknown as string[]
                      ).map((err) => (
                        <div
                          className="text-error flex items-center text-base/6 font-semibold"
                          key={`err-${field.name}-${err}`}
                        >
                          <FontAwesomeIcon
                            icon={faCircleExclamation}
                            className="fa-fw fa-lg mr-1"
                          />
                          <span>{err}</span>
                        </div>
                      ))}
                    {field.state.meta.errors.length > 0 &&
                      field.state.meta.errors.map((err) => (
                        <div
                          className="text-error flex items-center text-base/6 font-semibold"
                          key={`err-${field.name}-${err}`}
                        >
                          <FontAwesomeIcon
                            icon={faCircleExclamation}
                            className="fa-fw fa-lg mr-1"
                          />
                          <span>{err}</span>
                        </div>
                      ))}
                  </>
                )}
              </form.Field>

              <form.Field name="email">
                {(field) => (
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Email</legend>
                    <label
                      htmlFor="email"
                      className="input input-neutral w-full"
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
                        onChange={(ev) => field.handleChange(ev.target.value)}
                        className=""
                        required
                      />
                    </label>
                  </fieldset>
                )}
              </form.Field>

              <form.Field name="password">
                {(field) => (
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Password</legend>
                    <label
                      htmlFor="password"
                      className="input input-neutral w-full"
                    >
                      <FontAwesomeIcon icon={faLock} className="fa-fw fa-md" />
                      <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="YouStr0ngPassw0rd$"
                        value={field.state.value}
                        onChange={(ev) => field.handleChange(ev.target.value)}
                        className=""
                        required
                      />
                    </label>
                  </fieldset>
                )}
              </form.Field>

              <form.Field name="confirmPassword">
                {(field) => (
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">
                      Confirm password
                    </legend>
                    <label
                      htmlFor="confirmPassword"
                      className="input input-neutral w-full"
                    >
                      <FontAwesomeIcon icon={faLock} className="fa-fw fa-md" />
                      <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        placeholder="YouStr0ngPassw0rd$"
                        value={field.state.value}
                        onChange={(ev) => field.handleChange(ev.target.value)}
                        className=""
                        required
                      />
                    </label>
                  </fieldset>
                )}
              </form.Field>
            </div>

            <div className="card-actions mt-5">
              <button type="submit" className="btn btn-primary w-full">
                <span>Sign up</span>
                {!loading || signUpMutation.isPending ? (
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

            <Link
              href={{
                pathname: '/auth/sign-in',
              }}
              className="btn btn-secondary w-full"
            >
              <span>Sign in</span>
              <FontAwesomeIcon icon={faRightToBracket} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
