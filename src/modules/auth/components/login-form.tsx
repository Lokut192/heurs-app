'use client';

import {
  faRightToBracket,
  faSpinnerThird,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from '@tanstack/react-form';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function LoginForm(): React.ReactNode {
  /* States */
  const [loading, setLoading] = useState<boolean>(false);

  /* Form */
  // Define login form
  const form = useForm({
    defaultValues: {
      login: '',
      password: '',
    },
    onSubmit({ value, formApi: _formApi, meta: _meta }) {
      signIn('credentials', { ...value, callbackUrl: '/dashboard' });
    },
  });

  /* Render */
  return (
    <div className="card card-border border-base-300 bg-base-100">
      <div className="card-body">
        <h1 className="card-title">Sign in</h1>
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            setLoading(true);
            form.handleSubmit();
          }}
        >
          <div className="flex flex-col gap-4">
            <form.Field name="login">
              {(field) => (
                <label htmlFor="login" className="input">
                  <span className="label">Login</span>
                  <input
                    type="text"
                    name="login"
                    id="login"
                    placeholder="john.doe or john.doe@me.com"
                    value={field.state.value}
                    onChange={(ev) => field.handleChange(ev.target.value)}
                  />
                </label>
              )}
            </form.Field>

            <form.Field name="password">
              {(field) => (
                <label htmlFor="password" className="input">
                  <span className="label">Password</span>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="YouStr0ngPassw0rd$"
                    value={field.state.value}
                    onChange={(ev) => field.handleChange(ev.target.value)}
                  />
                </label>
              )}
            </form.Field>
          </div>

          <div className="mt-5 card-actions">
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
      </div>
    </div>
  );
}
