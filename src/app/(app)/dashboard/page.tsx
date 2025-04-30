import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/modules/auth/modules/next-auth/auth.options';

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
  /* Session */
  // Get session
  const session = await getServerSession(authOptions);
  // Check session validity
  if (session === null) {
    redirect('/auth/sign-in');
  }

  /* Render */
  return (
    <pre>
      <code>{JSON.stringify(session, null, 2)}</code>
    </pre>
  );
}
