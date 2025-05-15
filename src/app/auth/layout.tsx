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
    // <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 bg-[url('/static/background.svg')] bg-cover bg-center bg-no-repeat p-8 pb-20 sm:p-20">
    <div className="bg-gradient-login grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 sm:p-20">
      <main className="row-start-2 flex flex-col items-center gap-[32px] sm:items-start">
        {children}
      </main>
    </div>
  );
}

// #endregion Layout
