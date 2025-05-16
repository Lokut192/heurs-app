import type { Metadata } from 'next';

import SettingsInnerLayout from '@/_shared/layouts/settings-inner-layout';

type SettingsLayoutProps = {
  children?: React.ReactNode;
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
};

export const generateMetadata = async (
  _props: SettingsLayoutProps,
): Promise<Metadata> => {
  return {
    title: {
      template: '%s | Settings',
      default: 'Settings',
    },
  };
};

export default async function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  return <SettingsInnerLayout>{children}</SettingsInnerLayout>;
}
