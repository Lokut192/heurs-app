import type { Metadata } from 'next';

// #region Types

type DashboardIndexProps = {
  children: React.ReactNode;
  searchParams: Promise<Record<string, string>>;
};

// #endregion Types

// #region Metadata

export const generateMetadata = async (
  _props: DashboardIndexProps,
): Promise<Metadata> => {
  return {
    title: 'Dashboard',
  };
};

// #endregion Metadata

export default async function DashboardIndex(_props: DashboardIndexProps) {
  /* Render */
  return null;
}
