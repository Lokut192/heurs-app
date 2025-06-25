'use client';

import {
  faCircleExclamation,
  faRightToBracket,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

const SignInButton: React.FC<{
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}> = ({ className = '', onClick }) => (
  <Link
    href={{
      pathname: '/auth/sign-in',
    }}
    className={twMerge('btn btn-primary w-full', className)}
    onClick={(ev) => {
      onClick?.(ev);
    }}
  >
    <span>Sign in</span>
    <FontAwesomeIcon icon={faRightToBracket} className="ml-1" />
  </Link>
);

export default function VerifyEmailError() {
  return (
    <div className="card card-border border-base-300 bg-base-100 mx-auto w-full max-w-sm shadow sm:w-full sm:max-w-md">
      <div className="card-body">
        {/* <h1 className="card-title">Email verification</h1> */}

        <div className="flex flex-col items-center justify-center gap-2 text-red-500">
          <FontAwesomeIcon
            icon={faCircleExclamation}
            className="fa-3x text-red-500"
          />
          <div className="text-base/6 font-bold text-inherit">
            Token invalid or expired.
          </div>
          <div className="text-base/6 font-bold text-inherit">
            Please, sign in and try again.
          </div>
        </div>

        <div className="mt-5">
          <SignInButton />
        </div>
      </div>
    </div>
  );
}
