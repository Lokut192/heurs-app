'use client';

import { faCircleUser, faTimer } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { pathToRegexp } from 'path-to-regexp';

export type SettingsInnerLayoutProps = {
  children?: React.ReactNode;
};

const nav = [
  {
    name: 'My account',
    href: '/settings/my-account',
    icon: faCircleUser,
    regex: pathToRegexp('/settings/my-account').regexp,
  },
  {
    name: 'Times',
    href: '/settings/times',
    icon: faTimer,
    regex: pathToRegexp('/settings/times').regexp,
  },
];

function SettingsInnerLayout({ children }: SettingsInnerLayoutProps) {
  /* Routing */
  const pathname = usePathname();

  /* Render */
  return (
    <>
      <div className="border-base-300 bg-base-100 flex h-16 items-center overflow-x-auto overflow-y-hidden border-b px-2 sm:px-4">
        <ul className="menu menu-horizontal flex-nowrap gap-x-4 sm:gap-x-6">
          {nav.map((item) => (
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
