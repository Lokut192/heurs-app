// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports
import NextAuth, { type DefaultSession, type DefaultUser } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: number;
      username: string;
      accessToken: string;
      refreshToken: string;
    } & DefaultSession['user'];
  }
  interface User extends DefaultUser {
    id: number;
    username: string;
    accessToken: string;
    refreshToken: string;
  }
  // interface User {
  //   user: {
  //     accessToken: string;
  //     refreshToken: string;
  //   } & DefaultUser;
  // }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultUser {
    id: number;
    username: string;
    accessToken: string;
    refreshToken: string;
  }
}
