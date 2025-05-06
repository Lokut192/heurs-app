import type { Metadata } from 'next';

type AccountIndexProps = {
  searchParams: Promise<Record<string, string>>;
};

export const generateMetadata = async (
  _props: AccountIndexProps,
): Promise<Metadata> => {
  return {
    title: 'Account',
  };
};

export default async function AccountIndex(
  _props: AccountIndexProps,
): Promise<React.ReactNode> {
  /* Render */
  return <h1 className="text-5xl/9 font-bold">Account</h1>;
}
