'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export type ReactQueryProviderProps = {
  children?: React.ReactNode;
};

const queryClient = new QueryClient();

export default function ReactQueryProvider({
  children,
}: Readonly<ReactQueryProviderProps>): React.ReactNode {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
