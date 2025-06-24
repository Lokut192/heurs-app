import { getServerSession } from 'next-auth';

import AppInnerLayout from '@/_shared/layouts/app-inner-layout';
import getAxiosInstance from '@/_shared/services/get-axios-instance';
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

  /* Axios instance */
  const api = await getAxiosInstance();

  if (!!session?.user?.accessToken) {
    api.defaults.headers.common.Authorization = `Bearer ${session.user.accessToken}`;
  }

  /* Render */
  return (
    <ClientSessionProvider session={session}>
      <LoggedUserProvider
        session={session}
        roles={session?.user?.roles ?? []}
        grants={session?.user?.grants ?? []}
      >
        <AppInnerLayout>{children}</AppInnerLayout>
      </LoggedUserProvider>
    </ClientSessionProvider>
  );
}
