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
  },
});

export const {
  initMessages: initInboxMessages,
  receiveMessage: receiveInboxMessage,
  setConnectionStatus: setInboxConnectionStatus,
  setUnreadMessagesCount: setUnreadInboxMessagesCount,
} = inboxSliceStore.actions;

export default inboxSliceStore.reducer;
