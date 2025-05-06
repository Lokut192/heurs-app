import { faCircleInfo } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import type { Metadata } from 'next';

import { NextMonthStatsNavButton } from '@/modules/times-stats/components/button/nav/stats/month/next-month-stats-btn';
import { PreviousMonthStatsNavButton } from '@/modules/times-stats/components/button/nav/stats/month/prev-month-stats-btn';
import MonthStatistics from '@/modules/times-stats/components/stats/month-stats';
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
            <div role="alert" className="alert alert-info text-white">
              <FontAwesomeIcon icon={faCircleInfo} className="fa-fw fa-xl" />
              <span>Times statistics by month are coming soon...</span>
            </div>

            <MonthStatisticsProvider>
              <PreviousMonthStatsNavButton />
              <NextMonthStatsNavButton />
              <MonthStatistics />
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
