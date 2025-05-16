import type { Metadata } from 'next';

import DeleteAllTimesForm from '@/modules/times/components/form/settings/times-settings-form';

type TimesSettingsIndexProps = {
  searchParams: Promise<Record<string, string>>;
};

export const generateMetadata = async (
  _props: TimesSettingsIndexProps,
): Promise<Metadata> => {
  return {
    title: 'Times',
  };
};

export default async function TimesSettingsIndex(
  _props: TimesSettingsIndexProps,
): Promise<React.ReactNode> {
  return (
    <>
      <div className="divide-base-200 divide-y">
        <DeleteAllTimesForm />
      </div>
    </>
  );
}
