'use client';

import { configureStore } from '@reduxjs/toolkit';

import inboxReducer from '@/modules/inbox/stores/inbox-slice.store';

export const appStore = configureStore({
  reducer: {
    inbox: inboxReducer,
  },
});

export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;
