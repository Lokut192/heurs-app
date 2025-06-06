import { faCalendar, faList } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import type { Metadata } from 'next';

import { SaveTimeButton } from '@/modules/times/components/button/action/save-time-btn';
import { CurrentTimesTableNavButton } from '@/modules/times/components/button/nav/times-table/current-month-button';
import { NextTimesTableNavButton } from '@/modules/times/components/button/nav/times-table/next-button';
import { PreviousTimesTableNavButton } from '@/modules/times/components/button/nav/times-table/previous-button';
import { TodayTimesTableNavButton } from '@/modules/times/components/button/nav/times-table/today-button';
import TimesMonthCalendar from '@/modules/times/components/calendar/month/times-month-calendar';
import { TimesTable } from '@/modules/times/components/table/times-table';
import TimesTableProvider from '@/modules/times/providers/times-table.prov';
import SendMonthReportBtnProvider from '@/modules/times-stats/providers/send-month-report-btn.prov';

// #region Types

type TimesIndexProps = {
  children: React.ReactNode;
  searchParams: Promise<Record<string, string>>;
};

// #endregion Types

// #region Metadata

export const generateMetadata = async (
  _props: TimesIndexProps,
): Promise<Metadata> => {
  return {
    title: { absolute: 'Times' },
  };
};

// #endregion Metadata

export default async function TimesIndex(_props: TimesIndexProps) {
  /* Render */
  return (
    <>
      <h1 className="text-5xl/9 font-bold">Times</h1>
      <div className="mt-10 flex w-full items-center justify-end">
        <SaveTimeButton />
      </div>
      <TimesTableProvider>
        <TabGroup className="mt-5">
          <div className="flex w-full items-center justify-between">
            <TabList className="flex items-center">
              <Tab className="btn data-[selected]:bg-base-100 first:rounded-l-box last:rounded-r-box flex items-center justify-center rounded-none">
                <FontAwesomeIcon icon={faList} className="fa-lg" />
              </Tab>
              <Tab className="btn data-[selected]:bg-base-100 first:rounded-l-box last:rounded-r-box flex items-center justify-center rounded-none">
                <FontAwesomeIcon icon={faCalendar} className="fa-lg" />
              </Tab>
            </TabList>

            <div className="flex items-center justify-normal gap-2">
              <PreviousTimesTableNavButton className="btn-soft" />
              <TodayTimesTableNavButton className="btn-soft" />
              <NextTimesTableNavButton className="btn-soft" />
            </div>
          </div>

          <div className="mt-3 flex w-full justify-between">
            <CurrentTimesTableNavButton />
            <SendMonthReportBtnProvider />
          </div>

          <TabPanels className="mt-3">
            <TabPanel unmount={false}>
              <TimesTable />
            </TabPanel>
            <TabPanel unmount={false}>
              <TimesMonthCalendar />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </TimesTableProvider>
    </>
  );
}
