import type { Metadata } from 'next';

import type { PageAccessConfig } from '@/modules/auth/types/page-access-config.type';

import { InboxMessagesList } from './_components/list/inbox-messages-list';

// #region Access

export const pageAccess: PageAccessConfig = {
  grants: [],
  mode: 'any',
};

// #endregion Access

// #region Types

type InboxIndexProps = {
  children: React.ReactNode;
  searchParams: Promise<Record<string, string>>;
};

// #endregion Types

// #region Metadata

export const generateMetadata = async (
  _props: InboxIndexProps,
): Promise<Metadata> => {
  return {
    title: 'Inbox',
  };
};

// #endregion Metadata

export default async function InboxIndex(_props: InboxIndexProps) {
  /* Render */
  return (
    <>
      <h1 className="text-5xl/9 font-bold">Inbox</h1>

      <div className="mt-6 sm:mt-8 md:mt-10">
        <InboxMessagesList />
      </div>

      {/* <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="stats border-base-300 mt-10 border shadow">
          <RealtimeClockWidget />
        </div>
        <div className="stats border-base-300 mt-10 border shadow">
          <ActualBalanceStatsWidget />
        </div>
      </div> */}
    </>
  );
}
