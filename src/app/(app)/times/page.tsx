import type { Metadata } from 'next';

// #region Types

type TimesIndexProps = {
  children: React.ReactNode;
  searchParams: Promise<Record<string, string>>;
};

// #endregion Types

// #region Metadata

export const generateMetadata = async (
  _props: TimesIndexProps,
): Promise<Metadata> => {
  return {
    title: 'Times',
  };
};

// #endregion Metadata

export default async function TimesIndex(_props: TimesIndexProps) {
  /* Render */
  return <h1 className="text-5xl/9 font-bold">Times</h1>;
}
