import type { Metadata } from 'next';
import { Suspense } from 'react';

import LoginForm from '@/modules/auth/components/login-form';

// #region Types

type SignInIndexProps = {
  searchParams: Promise<Record<string, string>>;
};

// #endregion Types

// #region Metadata

export const generateMetadata = async (
  _props: SignInIndexProps,
): Promise<Metadata> => {
  return {
    title: 'Sign in',
  };
};

// #endregion Metadata

// #region Page

export default async function SignInIndex(_props: SignInIndexProps) {
  return (
    <>
      <Suspense>
        <LoginForm />
      </Suspense>
    </>
  );
}

// #endregion Page
