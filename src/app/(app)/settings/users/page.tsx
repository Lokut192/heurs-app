import type { Metadata } from 'next';
import type { User } from 'next-auth';

import type { PageAccessConfig } from '@/modules/auth/types/page-access-config.type';

export const pageAccess: PageAccessConfig = {
  grants: ['p_Role.SUPER_ADMIN', 'p_Role.ADMIN'],
  mode: 'any',
};

type UsersIndexProps = {
  searchParams: Promise<Record<string, string>>;
};

export const generateMetadata = async (
  _props: UsersIndexProps,
): Promise<Metadata> => {
  return {
    title: 'Users',
  };
};

export default async function UsersIndex(
  _props: User,
): Promise<React.ReactNode> {
  return null;
}
