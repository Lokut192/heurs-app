import { z } from 'zod/v4';

import { InboxMessageTypes } from '../enums/inbox-message-types.enum';

export const apiGetInboxMessageSchema = z.object({
  id: z.number(),

  type: z.enum(InboxMessageTypes),

  data: z.any().nullable(),

  isRead: z.boolean(),

  readAt: z.iso.datetime({ precision: 3, offset: true }).nullable(),

  sentAt: z.iso.datetime({ precision: 3, offset: true }).nullable(),
});

export type ApiGetInboxMessage = z.infer<typeof apiGetInboxMessageSchema>;
