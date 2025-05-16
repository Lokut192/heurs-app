import type { Metadata } from 'next';

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
  /* Render */
  return <h1 className="text-5xl/9 font-bold">Times settings</h1>;
}
