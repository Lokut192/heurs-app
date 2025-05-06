import type { Metadata } from 'next';

// #region Types

type TimesLayoutProps = {
  children?: React.ReactNode;
  searchParams: Promise<Record<string, string>>;
};

// #endregion Types

// #region Metadata

export const generateMetadata = async (
  _props: TimesLayoutProps,
): Promise<Metadata> => {
  return {
    title: {
      template: '%s | Times',
      default: 'Times',
    },
  };
};

// #endregion Metadata

export default async function TimesLayout({ children }: TimesLayoutProps) {
  /* Render */
  return children;
}
