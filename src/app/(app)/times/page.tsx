import type { Metadata } from 'next';

import { SaveTimeButton } from '@/modules/times/components/button/action/save-time-btn';
import { CurrentTimesTableNavButton } from '@/modules/times/components/button/nav/times-table/current-month-button';
import { NextTimesTableNavButton } from '@/modules/times/components/button/nav/times-table/next-button';
import { PreviousTimesTableNavButton } from '@/modules/times/components/button/nav/times-table/previous-button';
import { TodayTimesTableNavButton } from '@/modules/times/components/button/nav/times-table/today-button';
import { TimesTable } from '@/modules/times/components/table/times-table';
import TimesTableProvider from '@/modules/times/providers/times-table.prov';

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
      <TimesTableProvider>
        <div className="mt-10 flex flex-col gap-5">
          <div className="flex w-full items-center justify-end">
            <SaveTimeButton />
          </div>

          <div className="flex w-full items-center justify-between gap-4">
            <CurrentTimesTableNavButton />
            <div className="flex items-center justify-normal gap-2">
              <PreviousTimesTableNavButton className="btn-soft" />
              <TodayTimesTableNavButton className="btn-soft" />
              <NextTimesTableNavButton className="btn-soft" />
            </div>
          </div>

          <TimesTable />
        </div>
      </TimesTableProvider>
    </>
  );
}
