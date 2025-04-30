import { getServerSession } from 'next-auth';

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
  return <LoggedUserProvider session={session}>{children}</LoggedUserProvider>;
}
