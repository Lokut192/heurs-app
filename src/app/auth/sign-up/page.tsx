import type { Metadata } from 'next';
import { Suspense } from 'react';

import SignUpForm from '@/modules/auth/components/sign-up-form';

// #region Types

type SignUpIndexProps = {
  searchParams: Promise<Record<string, string>>;
};

// #endregion Types

// #region Metadata

export const generateMetadata = async (
  _props: SignUpIndexProps,
): Promise<Metadata> => {
  return {
    title: 'Sign up',
  };
};

// #endregion Metadata

// #region Page

export default async function SignUpIndex(_props: SignUpIndexProps) {
  return (
    <>
      <Suspense>
        <SignUpForm />
      </Suspense>
    </>
  );
}

// #endregion Page
