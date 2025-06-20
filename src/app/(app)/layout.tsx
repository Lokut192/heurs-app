import { getServerSession } from 'next-auth';

import AppInnerLayout from '@/_shared/layouts/app-inner-layout';
import getAxiosInstance from '@/_shared/services/get-axios-instance';
import type { Roles } from '@/modules/auth/enums/roles.enum';
import { authOptions } from '@/modules/auth/modules/next-auth/auth.options';
import ClientSessionProvider from '@/modules/auth/providers/client-session.prov';
import LoggedUserProvider from '@/modules/auth/providers/logged-user.prov';
import getMyGrants from '@/modules/me/services/get-my-grants.service';
import getMyRoles from '@/modules/me/services/get-my-roles.service';

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

  /* Logged user authorizations */
  let roles: Roles[] = [];
  let grants: string[] = [];
  try {
    [roles, grants] = await Promise.all([getMyRoles(api), getMyGrants(api)]);
  } catch (_unexpectedError) {
    roles = [];
    grants = [];
  }

  /* Render */
  return (
    <ClientSessionProvider session={session}>
      <LoggedUserProvider session={session} roles={roles} grants={grants}>
        <AppInnerLayout>{children}</AppInnerLayout>
      </LoggedUserProvider>
    </ClientSessionProvider>
  );
}
