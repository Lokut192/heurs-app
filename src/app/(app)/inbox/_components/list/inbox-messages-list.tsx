'use client';

import { faCheckDouble as faCheckDoubleDuotone } from '@fortawesome/pro-duotone-svg-icons';
import { faBellSlash, faSpinnerThird } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQueryClient } from '@tanstack/react-query';
import { DateTime } from 'luxon';
import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { toast } from 'react-toastify';

import { useAppDispatch } from '@/_shared/hooks/redux';
import { InboxMessageTypes } from '@/modules/inbox/enums/inbox-message-types.enum';
import { useMarkInboxMessageRead } from '@/modules/inbox/hooks/mutations/use-mark-inbox-message-read';
import { useMyInboxMessages } from '@/modules/inbox/hooks/queries/use-my-inbox-messages';
import type { ApiGetInboxMessage } from '@/modules/inbox/schemas/inbox-message.schemas';
import { markInboxMessageAsRead } from '@/modules/inbox/stores/inbox-slice.store';

// #region Reducers

type InboxMessagesReducerState = ApiGetInboxMessage[];
type InboxMessagesReducerAction =
  | {
      type: 'sync';
      payload: ApiGetInboxMessage[];
    }
  | { type: 'mark-as-read'; payload: { messageId: number } };

const InboxMessagesReducer: React.Reducer<
  InboxMessagesReducerState,
  InboxMessagesReducerAction
> = (state, action) => {
  switch (action.type) {
    case 'sync':
      return action.payload;
    case 'mark-as-read':
      return state.filter((message) => message.id !== action.payload.messageId);
    default:
      return state;
  }
};

// #endregion Reducers

// #region Utils

/**
 * Converts ISO Date to YYYY-MM-DD
 * @param {string} sentAt ISO Date
 * @returns YYYY-MM-DD
 */
const formatDateKey = (sentAt: string) => {
  if (!sentAt) return 'unknown';

  const date = DateTime.fromISO(sentAt);
  return date.toFormat('yyyy-MM-dd');
};

/**
 * Returns a human readable date title
 * @param {string} dateKey ISO Date (YYYY-MM-DD)
 * @param {number} diff Days difference
 * @returns "Today" / "Yesterday" / Date
 */
const getDateTitle = (dateKey: string, diff: number) => {
  switch (true) {
    case diff === 0:
      return 'Today';
    case diff === 1:
      return 'Yesterday';
    default:
      return DateTime.fromISO(dateKey).toLocaleString(DateTime.DATE_SHORT);
  }
};

// #endregion Utils

// #region Component

export const InboxMessagesList: React.FC = () => {
  /* Reducers */
  const [inboxMessages, dispatchInboxMessages] = useReducer(
    InboxMessagesReducer,
    [],
  );

  /* App Store */
  const dispatchApp = useAppDispatch();

  /* Query client */
  const queryClient = useQueryClient();

  /* Mutations */
  // Mark inbox message as read
  const markInboxMessageReadMutation = useMarkInboxMessageRead({
    mutationOptions: {
      onError(error, variables, _context) {
        // Re-sync inbox messages
        queryClient.refetchQueries({
          queryKey: ['my-inbox-messages'],
          exact: false,
        });

        if (process.env.NODE_ENV === 'development') {
          toast.error(
            `Could not mark message {${variables.messageId}} as read:`,
          );
        } else {
          toast.error(`Could not mark message as read:`);
        }

        toast.error(error.message);
      },
    },
  });

  /* Queries */
  // Messages
  const inboxMessagesQuery = useMyInboxMessages({
    queryParams: {
      page: 1,
      limit: -1,
    },
  });

  /* Callbacks */
  const handleInboxMessageAction: React.MouseEventHandler<HTMLUListElement> =
    useCallback((ev) => {
      const target = ev.target as HTMLUListElement;
      const messageListItem = target.closest(
        'li[data-message-id]',
      ) as HTMLLIElement | null;

      if (!messageListItem) {
        return;
      }

      ev.stopPropagation();
      ev.preventDefault();

      const actionButton = target.closest(
        'button[data-action]',
      ) as HTMLButtonElement | null;

      if (!actionButton) {
        return;
      }

      const strMessageId = messageListItem.dataset.messageId;

      if (
        typeof strMessageId !== 'string' ||
        !/^\d+$/.test(strMessageId) ||
        Number.isNaN(Number(strMessageId))
      ) {
        return;
      }

      const messageId = Number(strMessageId);

      const action = actionButton.dataset.action;

      switch (action) {
        case 'mark-read':
          markInboxMessageReadMutation.mutate({ messageId });
          dispatchInboxMessages({
            type: 'mark-as-read',
            payload: { messageId },
          });
          dispatchApp(markInboxMessageAsRead(messageId));
          break;
        default:
          break;
      }
    }, []);

  /* Memoized values */
  // Group messages by date
  const groupedMessages: Record<string, ApiGetInboxMessage[]> = useMemo(() => {
    return Array.from(inboxMessages).reduce((acc, message) => {
      const dateKey = formatDateKey(message.sentAt);
      // @ts-ignore
      if (!acc[dateKey]) {
        // @ts-ignore
        acc[dateKey] = [];
      }
      // @ts-ignore
      acc[dateKey].push(message);
      return acc;
    }, {});
  }, [inboxMessages]);

  // Sort messages by sent date desc
  const sortedDateEntries: [string, ApiGetInboxMessage[]][] = useMemo(() => {
    return Object.entries(groupedMessages).sort(([dateA], [dateB]) => {
      return dateB.localeCompare(dateA);
    });
  }, [groupedMessages]);

  // Calculate days difference
  const dateDiffs = useMemo(() => {
    const now = DateTime.now();
    return Object.fromEntries(
      Object.keys(groupedMessages).map((dateKey) => [
        dateKey,
        Math.floor(Math.abs(DateTime.fromISO(dateKey).diff(now).as('days'))),
      ]),
    );
  }, [groupedMessages]);

  /* Effects */
  // Sync inbox messages
  useEffect(() => {
    if (inboxMessagesQuery.isSuccess) {
      dispatchInboxMessages({
        type: 'sync',
        payload: inboxMessagesQuery.data,
      });
    }
  }, [inboxMessagesQuery.fetchStatus, inboxMessagesQuery.dataUpdatedAt]);

  /* Render */
  return (
    <>
      {/* <pre>
        <code>{JSON.stringify(inboxMessages, null, 2)}</code>
      </pre> */}

      {inboxMessagesQuery.isSuccess && sortedDateEntries.length === 0 && (
        <div className="alert alert-info alert-soft !shadow">
          <FontAwesomeIcon
            icon={faBellSlash}
            className="text-inherit"
            size="xl"
          />

          <div>
            <p className="text-base/6 font-medium">
              You have no notification in your inbox yet.
            </p>
          </div>
        </div>
      )}

      {inboxMessagesQuery.isPending && sortedDateEntries.length === 0 && (
        <div className="alert alert-soft !shadow">
          <FontAwesomeIcon
            icon={faSpinnerThird}
            className="animate-spin"
            size="xl"
          />

          <div>
            <p className="text-base/6 font-medium">Loading notifications...</p>
          </div>
        </div>
      )}

      {sortedDateEntries.length > 0 && (
        <ul
          className="flex w-full flex-col gap-4 sm:gap-6 md:gap-8"
          onClick={handleInboxMessageAction}
        >
          {sortedDateEntries.map(([dateKey, messages]) => {
            const diff = dateDiffs[dateKey];

            return (
              <li
                key={`inbox-messages-for-${dateKey}`}
                className="flex flex-col gap-2 sm:gap-4 md:gap-6"
              >
                <h2 className="text-3xl/9 font-bold">
                  {getDateTitle(dateKey, diff)}
                </h2>

                <ul className="list bg-base-100 rounded-box border-base-300 border shadow-md">
                  {messages?.map((m) => (
                    <li
                      key={m.id}
                      data-message-id={m.id.toString()}
                      className="list-row flex items-center justify-between"
                    >
                      <div className="grow">
                        {(() => {
                          switch (m.type) {
                            case InboxMessageTypes.Message:
                              return (
                                <>
                                  <div className="flex items-center gap-x-2 sm:gap-x-4">
                                    <h4 className="text-lg/7 font-semibold">
                                      Message
                                    </h4>

                                    <span className="text-base-content/90 text-xs/6 font-normal">
                                      {DateTime.fromISO(
                                        m.sentAt,
                                      ).toLocaleString(DateTime.TIME_24_SIMPLE)}
                                    </span>
                                  </div>

                                  <p
                                    className="mt-1 text-sm/6 font-medium whitespace-break-spaces"
                                    dangerouslySetInnerHTML={{
                                      __html: m.data.message,
                                    }}
                                  />
                                </>
                              );
                            default:
                              return null;
                          }
                        })()}
                      </div>
                      <div className="flex-none">
                        <button
                          type="button"
                          data-action="mark-read"
                          className="btn btn-accent btn-soft text-accent flex flex-nowrap items-center gap-x-2.5 hover:text-white"
                        >
                          <FontAwesomeIcon
                            icon={faCheckDoubleDuotone}
                            className="text-inherit"
                          />
                          <span className="sr-only">Mark Read</span>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

// #endregion Component
