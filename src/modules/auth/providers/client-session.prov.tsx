'use client';

import type { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

export type ClientSessionProviderProps = {
  children?: React.ReactNode;
  session?: Session | null | undefined;
};

export default function ClientSessionProvider({
  children,
  session,
}: ClientSessionProviderProps): React.ReactNode {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
