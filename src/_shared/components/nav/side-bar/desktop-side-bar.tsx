'use client';

import { faHome, faTimer, faWrench } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
  {
    title: 'Dashboard',
    icon: faHome,
    href: '/dashboard',
  },
];
const plugins = [
  {
    title: 'Times',
    icon: faTimer,
    href: '/times',
  },
];

export default function DesktopSideBar(): React.ReactNode {
  /* Routing */
  const pathname = usePathname();

  /* Render */
  return (
    <div className="bg-base-200 hidden h-full lg:fixed lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col overflow-y-auto px-3 pb-4">
        {/* <div className="flex shrink-0 items-center justify-center">
          <Image
            alt="Your Company"
            src="/static/logo-no-bg.png"
            width={64}
            height={64}
          />
        </div>
        <div className="divider" /> */}
        <ul className="menu menu-vertical w-full gap-y-2">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={
                  pathname.startsWith(item.href)
                    ? 'bg-base-content/5 hover:bg-base-content/10'
                    : ''
                }
              >
                <FontAwesomeIcon icon={item.icon} />
                {item.title}
              </Link>
            </li>
          ))}

          {/* Plugins */}
          <li>
            <div className="menu-title">Plugins</div>
            <ul>
              {plugins.map((item) => (
                <li key={`${item.href}`}>
                  <Link
                    href={`${item.href}`}
                    className={
                      pathname.startsWith(`${item.href}`)
                        ? 'bg-base-content/5 hover:bg-base-content/10'
                        : ''
                    }
                  >
                    <FontAwesomeIcon icon={item.icon} />
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>

      <ul className="menu menu-vertical w-full">
        <li>
          <Link
            href={'/settings'}
            className={
              pathname.startsWith('/settings')
                ? 'bg-base-content/5 hover:bg-base-content/10'
                : ''
            }
          >
            <FontAwesomeIcon icon={faWrench} />
            Settings
          </Link>
        </li>
      </ul>
    </div>
  );
}
