// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports
import NextAuth, { type DefaultSession, type DefaultUser } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      accessToken: string;
      refreshToken: string;
    } & DefaultSession['user'];
  }
  interface User {
    user: {
      accessToken: string;
      refreshToken: string;
    } & DefaultUser;
  }
}
