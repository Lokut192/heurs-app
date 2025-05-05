import type { Metadata } from 'next';

import { SaveTimeButton } from '@/modules/times/components/button/action/save-time-btn';
import { TimesTable } from '@/modules/times/components/table/times-table';

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
      <div className="mt-10 flex flex-col gap-5">
        <div className="flex w-full items-center justify-end">
          <SaveTimeButton />
        </div>

        <TimesTable />
      </div>
    </>
  );
}
