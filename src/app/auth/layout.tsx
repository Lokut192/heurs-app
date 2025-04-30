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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-[url('/static/background.svg')] bg-no-repeat bg-cover bg-center">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {children}
      </main>
    </div>
  );
}

// #endregion Layout
