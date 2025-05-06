import NextAuth from 'next-auth';

import { authOptions } from './auth.options';

export const authHandler = NextAuth(authOptions);
