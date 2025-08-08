'use client';

import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { ApiGetInboxMessage } from '../schemas/inbox-message.schemas';

const inboxSliceStore = createSlice({
  name: 'inbox',

  initialState: {
    messages: [] as ApiGetInboxMessage[],
    unreadMessagesCount: 0,
    isConnected: false,
    dataUpdatedAt: Date.now(),
  },

  reducers: {
    initMessages(state, action: PayloadAction<ApiGetInboxMessage[]>) {
      state.messages = action.payload;
      state.dataUpdatedAt = Date.now();
    },

    setUnreadMessagesCount(state, action: PayloadAction<number>) {
      state.unreadMessagesCount = action.payload;
      state.dataUpdatedAt = Date.now();
    },

    receiveMessage(state, action: PayloadAction<ApiGetInboxMessage>) {
      state.messages.unshift(action.payload);
      state.dataUpdatedAt = Date.now();
    },

    setConnectionStatus(state, action: PayloadAction<boolean>) {
      state.isConnected = action.payload;
    },

    markMessageAsRead(state, action: PayloadAction<number>) {
      state.messages = state.messages.filter(
        (message) => message.id !== action.payload,
      );
      state.unreadMessagesCount = Math.max(0, state.unreadMessagesCount - 1);
      state.dataUpdatedAt = Date.now();
    },
  },
});

export const {
  initMessages: initInboxMessages,
  receiveMessage: receiveInboxMessage,
  setConnectionStatus: setInboxConnectionStatus,
  setUnreadMessagesCount: setUnreadInboxMessagesCount,
  markMessageAsRead: markInboxMessageAsRead,
} = inboxSliceStore.actions;

export default inboxSliceStore.reducer;
