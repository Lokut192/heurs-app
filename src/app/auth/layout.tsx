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
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}

// #endregion Layout
