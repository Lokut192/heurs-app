// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports
import NextAuth, { type DefaultSession, type DefaultUser } from 'next-auth';

import type { Roles } from '../../enums/roles.enum';

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
      roles: Roles[];
      grants: string[];
    } & DefaultSession['user'];
  }
  interface User extends DefaultUser {
    id: number;
    username: string;
    accessToken: string;
    refreshToken: string;
    roles: Roles[];
    grants: string[];
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
    roles: Roles[];
    grants: string[];
  }
}
