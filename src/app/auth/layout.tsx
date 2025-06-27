/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';

// #region Types

type AuthLayoutProps = {
  children: React.ReactNode;
  searchParams: Promise<Record<string, string>>;
};

// #endregion Types

// #region Metadata

export const generateMetadata = async (
  _props: AuthLayoutProps,
): Promise<Metadata> => {
  return {
    title: {
      template: '%s | Auth',
      default: 'Auth',
    },
  };
};

// #endregion Metadata

// #region Layout

export default async function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="bg-gradient-login size-full">
      <div className="flex min-h-full flex-1 flex-col justify-center gap-y-4 py-12 sm:gap-y-6 sm:px-6 lg:gap-y-8 lg:px-8">
        <img
          src={`/static/logo-zycron-app-white.svg`}
          alt="logo"
          className="mx-auto h-20"
        />
        {children}
      </div>
    </div>
  );
}

// #endregion Layout
