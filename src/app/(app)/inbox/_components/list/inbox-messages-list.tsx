'use client';

import { DateTime } from 'luxon';
import { useMemo } from 'react';

import { useMyInboxMessages } from '@/modules/inbox/hooks/queries/use-my-inbox-messages';

export const InboxMessagesList: React.FC = () => {
  /* Queries */
  // Messages
  const inboxMessagesQuery = useMyInboxMessages({
    queryParams: {
      page: 1,
      limit: -1,
    },
  });

  const groupedMessages = useMemo(() => {
    return Object.groupBy(Array.from(inboxMessagesQuery.data), (message) => {
      if (!message.sentAt) return 'unknown';

      const date = new Date(message.sentAt);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    });
  }, [inboxMessagesQuery.fetchStatus, inboxMessagesQuery.dataUpdatedAt]);

  /* Render */
  return (
    <>
      {/* <pre>
        <code>{JSON.stringify(groupedMessages, null, 2)}</code>
      </pre> */}

      <ul>
        {Object.entries(groupedMessages).map(([date, messages]) => {
          const diff = Math.floor(
            Math.abs(DateTime.fromISO(date).diffNow().as('days')),
          );

          return (
            <li key={`inbox-messages-for-${date}`}>
              <h3>
                {(() => {
                  switch (true) {
                    case diff === 0:
                      return 'Today';
                    case diff === 1:
                      return 'Yesterday';
                    default:
                      return DateTime.fromISO(date).toLocaleString(
                        DateTime.DATE_SHORT,
                      );
                  }
                })()}
              </h3>

              <ul>
                {messages?.map((m) => (
                  <li key={m.id}>{m.data.message}</li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </>
  );
};
