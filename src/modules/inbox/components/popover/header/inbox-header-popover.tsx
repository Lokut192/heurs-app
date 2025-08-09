'use client';

import { faBullhorn } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  CloseButton,
  Popover,
  PopoverButton,
  PopoverPanel,
} from '@headlessui/react';
import Link from 'next/link';

import { useAppSelector } from '@/_shared/hooks/redux';
import { InboxMessageTypes } from '@/modules/inbox/enums/inbox-message-types.enum';

type InboxHeaderPopoverProps = {};

function InboxHeaderPopover(_props: InboxHeaderPopoverProps) {
  /* App store */
  // Get inbox messages
  const { messages, unreadMessagesCount } = useAppSelector(
    (state) => state.inbox,
  );

  /* Render */
  return (
    <Popover>
      <PopoverButton className="relative cursor-pointer focus:outline-none focus-visible:outline-none">
        <FontAwesomeIcon icon={faBullhorn} className="fa-lg text-baseContent" />

        {unreadMessagesCount > 0 && (
          <div className="absolute -top-1/2 -right-1/2 flex size-5 items-center justify-center rounded-full bg-red-500">
            <span className="text-center text-xs font-medium text-white">
              {unreadMessagesCount > 9 ? '+9' : unreadMessagesCount}
            </span>
          </div>
        )}
      </PopoverButton>

      <PopoverPanel
        as="div"
        transition
        anchor="bottom end"
        // className="z-40 shadow-xl transition duration-200 ease-in-out"
        className="text-base-content rounded-box border-base-300 bg-base-300 w-72 border p-2 text-sm/6 shadow-2xl transition duration-200 ease-in-out [--anchor-gap:--spacing(5)] data-closed:-translate-y-1 data-closed:opacity-0"
      >
        <h3 className="text-base-content pl-1 text-lg/7 font-bold">Inbox</h3>
        <ul className="divide-base-300 max-h-80 w-full divide-y overflow-y-auto [&>*]:py-2 [&>*:first-child]:pt-0 [&>*:last-child]:pb-0">
          {messages.map((m) => {
            return (
              <li
                key={`inbox-message-preview-${m.id}`}
                className="rounded-field cursor-pointer p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {(() => {
                  switch (m.type) {
                    case InboxMessageTypes.Message:
                    default:
                      return (
                        <>
                          <h4 className="text-base-content line-clamp-1 text-sm/5 font-medium">
                            Message
                          </h4>
                          <p
                            className="text-base-content/90 line-clamp-2 text-xs/4 font-normal"
                            dangerouslySetInnerHTML={{ __html: m.data.message }}
                          />
                        </>
                      );
                  }
                })()}
              </li>
            );
          })}
          {/* <li className="rounded-field cursor-pointer p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800">
            <h4 className="text-base-content line-clamp-1 text-sm/5 font-medium">
              Message title
            </h4>
            <p className="text-base-content/90 line-clamp-2 text-xs/4 font-normal">
              Velit qui pariatur anim aliqua cillum reprehenderit deserunt
              cupidatat adipisicing. Minim labore nostrud magna commodo eiusmod
              sunt id aliqua. Eu commodo eiusmod tempor consectetur aliqua ipsum
              do dolore occaecat incididunt. Adipisicing incididunt incididunt
              fugiat aliqua enim amet voluptate pariatur duis pariatur pariatur
              sint. Laborum aute aute sunt voluptate pariatur labore ullamco
              fugiat sit aliqua. Adipisicing mollit laboris qui elit labore
              reprehenderit consectetur duis.
            </p>
          </li> */}
        </ul>

        <CloseButton
          as={Link}
          href={{ pathname: `/inbox` }}
          className="btn mt-3 w-full"
        >
          View all
        </CloseButton>
      </PopoverPanel>
    </Popover>
  );
}

export default InboxHeaderPopover as React.FC<InboxHeaderPopoverProps>;
