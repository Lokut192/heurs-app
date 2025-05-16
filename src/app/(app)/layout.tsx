import { getServerSession } from 'next-auth';

import AppInnerLayout from '@/_shared/layouts/app-inner-layout';
import { authOptions } from '@/modules/auth/modules/next-auth/auth.options';
import ClientSessionProvider from '@/modules/auth/providers/client-session.prov';
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
    <ClientSessionProvider session={session}>
      <LoggedUserProvider session={session}>
        <AppInnerLayout>{children}</AppInnerLayout>
      </LoggedUserProvider>
    </ClientSessionProvider>
  );
}
