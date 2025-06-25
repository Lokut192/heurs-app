'use client';

import {
  faCircleCheck,
  faRightToBracket,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { use } from 'react';
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

export type VerifyEmailSuccessBlockProps = {
  verifyEmailPromise: Promise<void>;
};

function VerifyEmailSuccessBlock({
  verifyEmailPromise,
}: VerifyEmailSuccessBlockProps): React.ReactNode {
  /* Promise */
  use(verifyEmailPromise);

  /* Render */
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-2 text-green-500">
        <FontAwesomeIcon
          icon={faCircleCheck}
          className="fa-3x text-green-500"
        />
        <div className="text-base/6 font-bold text-inherit">
          Email verified.
        </div>
        <div className="text-base/6 font-bold text-inherit">
          You can now sign in or close this window.
        </div>
      </div>

      <div className="mt-5">
        <SignInButton />
      </div>
    </>
  );
}

export default VerifyEmailSuccessBlock as React.FC<VerifyEmailSuccessBlockProps>;
