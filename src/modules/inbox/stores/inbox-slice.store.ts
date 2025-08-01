'use client';

import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { ApiGetInboxMessage } from '../schemas/inbox-message.schemas';

const inboxSliceStore = createSlice({
  name: 'inbox',

  initialState: {
    massages: [] as ApiGetInboxMessage[],
    isConnected: false,
    dataUpdatedAt: Date.now(),
  },

  reducers: {
    initMessages(state, action: PayloadAction<ApiGetInboxMessage[]>) {
      state.massages = action.payload;
      state.dataUpdatedAt = Date.now();
    },

    receiveMessage(state, action: PayloadAction<ApiGetInboxMessage>) {
      state.massages.unshift(action.payload);
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
} = inboxSliceStore.actions;

export default inboxSliceStore.reducer;
