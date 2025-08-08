'use client';

import type { Action, UnknownAction } from '@reduxjs/toolkit';
import type { ProviderProps } from 'react-redux';
import { Provider } from 'react-redux';

export const ReduxClientProvider = <
  A extends Action<string> = UnknownAction,
  S = unknown,
>({
  children,
  ...providerProps
}: ProviderProps<A, S>): React.ReactNode => {
  return <Provider {...providerProps}>{children}</Provider>;
};
