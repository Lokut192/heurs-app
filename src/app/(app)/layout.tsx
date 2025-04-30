import { getServerSession } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

import { authOptions } from '@/modules/auth/modules/next-auth/auth.options';
import LoggedUserProvider from '@/modules/auth/providers/logged-user.prov';

type AppLayoutProps = {
  searchParams: Promise<Record<string, string>>;
  children: React.ReactNode;
};

export default async function AppLayout({ children }: AppLayoutProps) {
  /* Session */
  // Get session
  const session = await getServerSession(authOptions);

  /* Render */
  return (
    <SessionProvider session={session}>
      <LoggedUserProvider session={session}>{children}</LoggedUserProvider>
    </SessionProvider>
  );
}
