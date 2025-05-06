import { getServerSession } from 'next-auth';

import SearchBar from '@/_shared/components/nav/search-bar';
import DesktopSideBar from '@/_shared/components/nav/side-bar/desktop-side-bar';
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
        <DesktopSideBar />
        <div className="lg:pl-72">
          {/* Search bar */}
          <SearchBar />

          {/* Content */}
          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </LoggedUserProvider>
    </ClientSessionProvider>
  );
}
