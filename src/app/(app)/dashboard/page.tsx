import type { Metadata } from 'next';

import RealtimeClockWidget from '@/_shared/components/widgets/realtime-clock-widget';
import type { PageAccessConfig } from '@/modules/auth/types/page-access-config.type';
import ActualBalanceStatsWidget from '@/modules/times-stats/components/widget/stats/actual-balance';

// #region Access

export const pageAccess: PageAccessConfig = {
  grants: [],
  mode: 'any',
};

// #endregion Access

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
  return (
    <>
      <h1 className="text-5xl/9 font-bold">Dashboard</h1>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="stats border-base-300 mt-10 border shadow">
          <RealtimeClockWidget />
        </div>
        <div className="stats border-base-300 mt-10 border shadow">
          <ActualBalanceStatsWidget />
        </div>
      </div>
    </>
  );
}
