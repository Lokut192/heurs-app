import type { Metadata } from 'next';

type SettingsLayoutProps = {
  children?: React.ReactNode;
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
  return children;
}
