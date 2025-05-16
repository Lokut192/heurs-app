import { faCircleInfo } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import type { Metadata } from 'next';
import { Suspense } from 'react';

import { CurrentMonthStatsButton } from '@/modules/times-stats/components/button/nav/stats/month/current-month-stats-btn';
import { NextMonthStatsNavButton } from '@/modules/times-stats/components/button/nav/stats/month/next-month-stats-btn';
import { PreviousMonthStatsNavButton } from '@/modules/times-stats/components/button/nav/stats/month/prev-month-stats-btn';
import { TodayStatsButton } from '@/modules/times-stats/components/button/nav/stats/month/today-stats-btn';
import MonthDurationBalanceChart from '@/modules/times-stats/components/chart/stat/month/month-duration-balance-chart';
import ActualBalanceStatsWidget from '@/modules/times-stats/components/widget/stats/actual-balance';
import ActualWeekAverageDurationStatsWidget from '@/modules/times-stats/components/widget/stats/actual-week-avg-duration';
import ActualMonthAverageDurationStatsWidget from '@/modules/times-stats/components/widget/stats/acutal-month-avg-duration';
import OvertimeMonthStats from '@/modules/times-stats/components/widget/stats/month/overtime-month-stats';
import RecoveryMonthStats from '@/modules/times-stats/components/widget/stats/month/recovery-month-stats';
import TotalMonthStats from '@/modules/times-stats/components/widget/stats/month/total-month-stats';
import MonthStatisticsProvider from '@/modules/times-stats/providers/month-stats.prov';

// #region Types

type TimesStatisticsIndexProps = {
  searchParams: Promise<Record<string, string>>;
};

// #endregion Types

// #region Metadata

export const generateMetadata = async (
  _props: TimesStatisticsIndexProps,
): Promise<Metadata> => {
  return {
    title: 'Statistics',
  };
};

// #endregion Metadata

export default async function TimesStatisticsIndex(
  _props: TimesStatisticsIndexProps,
): Promise<React.ReactNode> {
  /* Render */
  return (
    <>
      <h1 className="text-5xl/9 font-bold">Times statistics</h1>

      <div className="stats mt-10 max-w-full overflow-x-auto shadow">
        <ActualBalanceStatsWidget />
        <ActualWeekAverageDurationStatsWidget />
        <ActualMonthAverageDurationStatsWidget />
      </div>

      <TabGroup className="mt-10" defaultIndex={1}>
        <TabList as="div" className="tabs tabs-border">
          {/* <Tab className="tab focus-visible:outline-none">By week</Tab> */}
          <Tab className="tab">By week</Tab>
          <Tab className="tab">By month</Tab>
          <Tab className="tab">By year</Tab>
        </TabList>

        <TabPanels className="p-3 pt-5">
          <TabPanel className="">
            <div role="alert" className="alert alert-info text-white">
              <FontAwesomeIcon icon={faCircleInfo} className="fa-fw fa-xl" />
              <span>Times statistics by week are coming soon...</span>
            </div>
          </TabPanel>
          <TabPanel className="">
            {/* <div role="alert" className="alert alert-info text-white">
              <FontAwesomeIcon icon={faCircleInfo} className="fa-fw fa-xl" />
              <span>Times statistics by month are coming soon...</span>
            </div> */}
            <MonthStatisticsProvider>
              <div className="flex w-full flex-col gap-5">
                <div className="stats border-base-300 border shadow">
                  <TotalMonthStats />
                  <OvertimeMonthStats />
                  <RecoveryMonthStats />
                </div>
                <div className="flex w-full items-center justify-between gap-4">
                  <CurrentMonthStatsButton />

                  <div className="flex items-center justify-normal gap-2">
                    <PreviousMonthStatsNavButton className="btn-soft" />
                    <TodayStatsButton className="btn-soft" />
                    <NextMonthStatsNavButton className="btn-soft" />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
                  <Suspense>
                    <MonthDurationBalanceChart />
                  </Suspense>
                </div>
              </div>
            </MonthStatisticsProvider>
          </TabPanel>
          <TabPanel className="">
            <div role="alert" className="alert alert-info text-white">
              <FontAwesomeIcon icon={faCircleInfo} className="fa-fw fa-xl" />
              <span>Times statistics by year are coming soon...</span>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </>
  );
}
