/* eslint-disable no-restricted-imports */

'use client';

import {
  faChartSimple,
  faChevronDown,
  faCircleUser,
  faCog,
  faFileExport,
  faHome,
  faSidebar,
  faTableRows,
  faTimer,
  faXmark,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from '@headlessui/react';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { pathToRegexp } from 'path-to-regexp';
import { useCallback, useEffect, useState } from 'react';

import SignOutButton from '@/modules/auth/components/sign-out-button';
import { useLoggedUser } from '@/modules/auth/hooks/use-logged-user';

import { useIsDesktopView } from '../hooks/utils/use-is-desktop-view';
import { useIsMac } from '../hooks/utils/use-is-mac';

export type AppInnerLayoutProps = {
  children?: React.ReactNode;
};

const commonNavigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: faHome,
    current: true,
    regex: pathToRegexp('/dashboard').regexp,
  },
];
const timesNav = [
  {
    name: 'Entries',
    icon: faTableRows,
    href: '/times',
    regex: pathToRegexp('/times').regexp,
  },
  {
    name: 'Statistics',
    icon: faChartSimple,
    href: '/times/statistics',
    regex: pathToRegexp('/times/statistics').regexp,
  },
  {
    name: 'Exports',
    icon: faFileExport,
    href: '/times/exports',
    regex: pathToRegexp('/times/exports').regexp,
  },
];
const userNavigation = [{ name: 'My account', href: '/settings/account' }];

function AppInnerLayout({ children }: AppInnerLayoutProps): React.ReactNode {
  /* States */
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [sidebarDesktopOpen, setSidebarDesktopOpen] = useState<boolean>(false);

  /* User */
  const { username } = useLoggedUser();

  /* Routing */
  const pathname = usePathname();

  /* Os */
  const isDesktop = useIsDesktopView();
  const isMac = useIsMac();

  /* Handler */
  // Listen on keys to provide keyboard shortcuts
  const handleKeyDown: (this: Window, ev: KeyboardEvent) => any = useCallback(
    (ev) => {
      const isShortcut =
        (isMac && ev.metaKey && ev.key === 'b') ||
        (!isMac && ev.ctrlKey && ev.key === 'b');

      if (isShortcut) {
        ev.preventDefault();
        setSidebarDesktopOpen((_prev) => {
          return !_prev;
        });
      }
    },
    [isMac],
  );
  // Closes mobile sidebar if a link is clicked
  const handleClickMenuItem: React.MouseEventHandler<HTMLUListElement> =
    useCallback((ev) => {
      const target = ev.target as HTMLElement;
      const link = target.closest('a');

      if (!!link) {
        setSidebarOpen(false);
      }
    }, []);

  /* Effects */
  useEffect(() => {
    const abortCtrl = new AbortController();

    try {
      window.addEventListener('keydown', handleKeyDown, {
        signal: abortCtrl.signal,
      });

      return () => {
        abortCtrl.abort();
      };
    } catch (_windowUndefinedException) {
      // Do nothing here
      return () => {};
    }
  }, []);

  useEffect(() => {
    setSidebarDesktopOpen(isDesktop);
  }, [isDesktop]);

  /* Render */
  return (
    <div>
      <Dialog
        open={sidebarOpen}
        onClose={setSidebarOpen}
        className="relative z-50 lg:hidden"
      >
        <DialogBackdrop
          transition
          className="bg-base-content/80 fixed inset-0 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />

        <div className="fixed inset-0 flex">
          <DialogPanel
            transition
            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
          >
            <TransitionChild>
              <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="-m-2.5 p-2.5"
                >
                  <span className="sr-only">Close sidebar</span>
                  {/* <XMarkIcon aria-hidden="true" className="size-6 text-white" /> */}
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="fa-fw fa-sm text-white"
                  />
                </button>
              </div>
            </TransitionChild>
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="bg-base-200 flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
              {/* <div className="flex h-16 shrink-0 items-center">
                <img
                  alt="Your Company"
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=white"
                  className="h-8 w-auto"
                />
              </div> */}
              <nav className="h-scree flex max-h-screen w-full flex-1 flex-col">
                <ul
                  role="list"
                  className="menu menu-vertical w-full flex-1 gap-y-4"
                  onClick={handleClickMenuItem}
                >
                  {commonNavigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="data-[current=true]:bg-base-content/5 data-[current=true]:hover:bg-base-content/10"
                        data-current={
                          item.regex.test(pathname) ? 'true' : 'false'
                        }
                      >
                        <FontAwesomeIcon
                          icon={item.icon}
                          className="fa-fw fa-sm"
                          data-current={
                            item.regex.test(pathname) ? 'true' : 'false'
                          }
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <div className="menu-title flex items-center gap-x-2">
                      <FontAwesomeIcon icon={faTimer} />
                      Times
                    </div>
                    <ul>
                      {timesNav.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="data-[current=true]:bg-base-content/5 data-[current=true]:hover:bg-base-content/10"
                            data-current={
                              item.regex.test(pathname) ? 'true' : 'false'
                            }
                          >
                            <FontAwesomeIcon
                              icon={item.icon}
                              className="fa-fw fa-sm"
                              data-current={
                                item.regex.test(pathname) ? 'true' : 'false'
                              }
                            />
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li className="mt-auto">
                    <Link
                      href="/settings"
                      data-current={
                        pathname.startsWith('/settings') ? 'true' : 'false'
                      }
                      className="data-[current=true]:bg-base-content/5 data-[current=true]:hover:bg-base-content/10"
                    >
                      <FontAwesomeIcon icon={faCog} className="fa-fw fa-sm" />
                      Settings
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Static sidebar for desktop */}

      <AnimatePresence>
        {sidebarDesktopOpen && (
          <motion.div
            initial={{ x: '-18rem', opacity: 0 }}
            animate={{ x: '0', opacity: 1 }}
            exit={{ x: '-18rem', opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col"
          >
            {/* Sidebar component, swap this element with another sidebar if you like */}
            <div className="bg-base-200 flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
              {/* <div className="flex h-16 shrink-0 items-center">
            <img
              alt="Your Company"
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=white"
              className="h-8 w-auto"
            />
          </div> */}
              <nav className="flex w-full flex-1 flex-col">
                <ul
                  role="list"
                  className="menu menu-vertical w-full flex-1 gap-y-2"
                >
                  {commonNavigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="data-[current=true]:bg-base-content/5 data-[current=true]:hover:bg-base-content/10"
                        data-current={
                          item.regex.test(pathname) ? 'true' : 'false'
                        }
                      >
                        <FontAwesomeIcon
                          icon={item.icon}
                          className="fa-fw fa-sm"
                          data-current={
                            item.regex.test(pathname) ? 'true' : 'false'
                          }
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <div className="menu-title flex items-center gap-x-2">
                      <FontAwesomeIcon icon={faTimer} />
                      Times
                    </div>
                    <ul>
                      {timesNav.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className="data-[current=true]:bg-base-content/5 data-[current=true]:hover:bg-base-content/10"
                            data-current={
                              item.regex.test(pathname) ? 'true' : 'false'
                            }
                          >
                            <FontAwesomeIcon
                              icon={item.icon}
                              className="fa-fw fa-sm"
                              data-current={
                                item.regex.test(pathname) ? 'true' : 'false'
                              }
                            />
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li className="mt-auto">
                    <Link
                      href="/settings"
                      data-current={
                        pathname.startsWith('/settings') ? 'true' : 'false'
                      }
                      className="data-[current=true]:bg-base-content/5 data-[current=true]:hover:bg-base-content/10"
                    >
                      <FontAwesomeIcon icon={faCog} className="fa-fw fa-sm" />
                      Settings
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        // initial={{ paddingLeft: '18rem' }}
        initial={{ paddingLeft: '0' }}
        animate={{ paddingLeft: sidebarDesktopOpen ? '18rem' : '0' }}
        transition={{ duration: 0.3 }}
      >
        <div className="border-base-300 bg-base-100 sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b px-4 sm:gap-x-6 sm:px-6 lg:px-8">
          <div className="flex-1">
            <button
              type="button"
              onClick={() => {
                if (isDesktop) {
                  setSidebarDesktopOpen((prev) => !prev);
                } else {
                  setSidebarOpen((prev) => !prev);
                }
              }}
              className="text-base-content btn btn-ghost -m-2.5"
            >
              <span className="sr-only">Open sidebar</span>
              <FontAwesomeIcon icon={faSidebar} className="fa-fw fa-lg" />
            </button>
          </div>

          {/* Separator */}
          <div
            aria-hidden="true"
            className="bg-base-content/10 h-6 w-px lg:hidden"
          />

          <div className="flex gap-x-4 self-stretch lg:gap-x-6">
            {/* <form action="#" method="GET" className="grid flex-1 grid-cols-1">
              <input
                name="search"
                type="search"
                placeholder="Search"
                aria-label="Search"
                className="text-base-content bg-base-100 col-start-1 row-start-1 block size-full pl-8 text-base outline-hidden placeholder:text-gray-400 sm:text-sm/6"
              />
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="fa-fw fa-sm pointer-events-none col-start-1 row-start-1 self-center text-gray-400"
              />
            </form> */}
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">View notifications</span>
                <FontAwesomeIcon icon={faBell} className="fa-fw fa-sm" />
              </button> */}

              {/* Separator */}
              <div
                aria-hidden="true"
                className="lg:bg-base-content/10 hidden lg:block lg:h-6 lg:w-px"
              />

              {/* Profile dropdown */}
              <Menu as="div" className="relative">
                <MenuButton className="-m-1.5 flex cursor-pointer items-center p-1.5 focus-visible:outline-none">
                  <span className="sr-only">Open user menu</span>
                  {/* <img
                    alt=""
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    className="size-8 rounded-full bg-gray-50"
                  /> */}
                  <FontAwesomeIcon
                    icon={faCircleUser}
                    className="fa-fw fa-2xl text-base-content"
                  />
                  <span className="hidden lg:flex lg:items-center">
                    <span
                      aria-hidden="true"
                      className="text-base-content ml-4 text-sm/6 font-semibold"
                    >
                      {username}
                    </span>
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className="fa-fw fa-sm ml-2 text-gray-400"
                    />
                  </span>
                </MenuButton>
                <MenuItems
                  transition
                  className="ring-base-content/5 bg-base-100 rounded-box absolute right-0 z-10 mt-2.5 w-52 origin-top-right p-2 shadow-lg ring-1 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  {userNavigation.map((item) => (
                    <MenuItem key={item.name}>
                      <Link
                        href={item.href}
                        className="text-base-content data-focus:bg-base-content/10 rounded-field block cursor-pointer px-3 py-1 text-sm/6 data-focus:outline-hidden"
                      >
                        {item.name}
                      </Link>
                    </MenuItem>
                  ))}
                  <MenuItem>
                    <SignOutButton
                      type="button"
                      className="text-base-content data-focus:bg-error/10 rounded-field block w-full cursor-pointer px-3 py-1 text-left text-sm/6 data-focus:outline-hidden"
                    >
                      Sign out
                    </SignOutButton>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </div>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </motion.div>
    </div>
  );
}

export default AppInnerLayout as React.FC<AppInnerLayoutProps>;
