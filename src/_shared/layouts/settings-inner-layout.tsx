'use client';

import type { IconDefinition } from '@fortawesome/pro-solid-svg-icons';
import {
  faCircleUser,
  faTimer,
  faUserGroup,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { pathToRegexp } from 'path-to-regexp';
import { useMemo } from 'react';

import { useLoggedUser } from '@/modules/auth/hooks/use-logged-user';
import type { PageAccessConfig } from '@/modules/auth/types/page-access-config.type';

export type SettingsInnerLayoutProps = {
  children?: React.ReactNode;
};

const nav: {
  name: string;
  href: string;
  icon: IconDefinition;
  regex: RegExp;
  pageAccess: PageAccessConfig;
}[] = [
  {
    name: 'My account',
    href: '/settings/my-account',
    icon: faCircleUser,
    regex: pathToRegexp('/settings/my-account').regexp,
    pageAccess: {
      grants: [],
      mode: 'any',
    },
  },
  {
    name: 'Times',
    href: '/settings/times',
    icon: faTimer,
    regex: pathToRegexp('/settings/times').regexp,
    pageAccess: {
      grants: [],
      mode: 'any',
    },
  },
  {
    name: 'Users',
    href: '/settings/users',
    icon: faUserGroup,
    regex: pathToRegexp('/settings/users').regexp,
    pageAccess: {
      grants: ['p_Role.SUPER_ADMIN', 'p_Role.ADMIN'],
      mode: 'any',
    },
  },
];

function SettingsInnerLayout({ children }: SettingsInnerLayoutProps) {
  /* Logged user */
  const {
    hasEveryGrants: loggedUserHasEveryGrants,
    hasSomeGrants: loggedUserHasSomeGrants,
    grants: loggedUserGrants,
  } = useLoggedUser();

  /* Routing */
  const pathname = usePathname();

  /* Calculate user nav */
  const userNav = useMemo(() => {
    return nav.filter((item) => {
      if (item.pageAccess.grants.length === 0) {
        return true;
      }

      switch (item.pageAccess.mode) {
        case 'all':
          return loggedUserHasEveryGrants(...item.pageAccess.grants);
        case 'any':
          return loggedUserHasSomeGrants(...item.pageAccess.grants);
        default:
          return false;
      }
    });
  }, [loggedUserGrants.length]);

  /* Render */
  return (
    <>
      <div className="border-base-300 bg-base-100 flex h-16 items-center overflow-x-auto overflow-y-hidden border-b px-2 sm:px-4">
        <ul className="menu menu-horizontal flex-nowrap gap-x-4 sm:gap-x-6">
          {userNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                data-active={item.regex.test(pathname) ? 'true' : 'false'}
                className="data-[active=true]:bg-base-content/5 data-[active=true]:hover:bg-base-content/10 hover:bg-base-content/10"
              >
                <FontAwesomeIcon icon={item.icon} className="fa-fw fa-lg" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <main className="py-10">
        <div className="px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </>
  );
}

export default SettingsInnerLayout as React.FC<SettingsInnerLayoutProps>;
