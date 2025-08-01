import { z } from 'zod/v4';

export const LiveInboxMessageSchema = z.object({
  id: z.number(),
  type: z.enum(['MESSAGE']),
  data: z.object({
    message: z.string(),
  }),
  isRead: z.boolean(),
  readAt: z.iso.datetime({ precision: 3, offset: true }).nullable(),
  sentAt: z.iso.datetime({ precision: 3, offset: true }),
  user: z.object({
    id: z.number(),
  }),
});

export const LiveInboxMessageDataSchema = z.object({
  type: z.enum(['ping', 'message']),
  data: z.union([z.object({}), LiveInboxMessageSchema]),
  timestamp: z.number(),
});

// export const LiveInboxMessageDataJsonSchema = z.toJSONSchema(
//   LiveInboxMessageDataSchema,
// );
