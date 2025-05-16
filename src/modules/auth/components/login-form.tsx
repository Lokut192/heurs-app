'use client';

import { faCircleUser, faLock } from '@fortawesome/pro-light-svg-icons';
import {
  faRightToBracket,
  faSpinnerThird,
  faUserPlus,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from '@tanstack/react-form';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function LoginForm(): React.ReactNode {
  /* States */
  const [loading, setLoading] = useState<boolean>(false);

  /* Routing */
  const nextSearchParams = useSearchParams();

  /* Form */
  // Define login form
  const form = useForm({
    defaultValues: {
      login: '',
      password: '',
    },
    onSubmit({ value, formApi: _formApi, meta: _meta }) {
      let callbackUrl = '/dashboard';

      const searchParams = new URLSearchParams(nextSearchParams.toString());

      if (searchParams.has('callbackUrl')) {
        callbackUrl = searchParams.get('callbackUrl') as string;
      }

      signIn('credentials', { ...value, callbackUrl });
    },
  });

  /* Render */
  return (
    <div className="card card-border border-base-300 bg-base-100 mx-auto w-full max-w-sm shadow sm:w-full sm:max-w-md">
      <div className="card-body">
        <h1 className="card-title">Sign in</h1>

        <div className="flex flex-col">
          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              ev.stopPropagation();
              setLoading(true);
              form.handleSubmit();
            }}
          >
            <div className="flex flex-col">
              <form.Field name="login">
                {(field) => (
                  <fieldset className="fieldset">
                    <legend className="fieldset-legend">Login</legend>
                    <label
                      htmlFor="login"
                      className="input input-neutral w-full"
                    >
                      <FontAwesomeIcon
                        icon={faCircleUser}
                        className="fa-fw fa-md"
                      />
                      <input
                        type="text"
                        name="login"
                        id="login"
                        placeholder="john.doe or john.doe@me.com"
                        value={field.state.value}
                        onChange={(ev) => field.handleChange(ev.target.value)}
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
                        required
                      />
                    </label>
                  </fieldset>
                )}
              </form.Field>
            </div>

            <div className="card-actions mt-5">
              <button type="submit" className="btn btn-primary w-full">
                <span>Login</span>
                {!loading ? (
                  <FontAwesomeIcon icon={faRightToBracket} className="ml-1" />
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
              No account yet?
            </h2>

            <Link
              href={{
                pathname: '/auth/sign-up',
              }}
              className="btn btn-secondary w-full"
            >
              <span>Sign up</span>
              <FontAwesomeIcon icon={faUserPlus} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
