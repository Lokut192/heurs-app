import axios, { isAxiosError } from 'axios';
import type { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type z from 'zod';

import { logger as globalLogger } from '@/_shared/utils/logger';

import type { apiSignInSchema } from '../../schemas/api-sign-in.schema';
import { signInSchema } from '../../schemas/sign-in.schema';

const logger = globalLogger.child({
  module: 'next-auth',
  name: 'NextAuth',
});

// NextAuth options
export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET ?? 'secret',

  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,
    updateAge: 7 * 24 * 60 * 60,
  },

  jwt: {
    maxAge: 7 * 24 * 60 * 60, // Same as session.maxAge
  },

  pages: {
    signIn: '/auth/sign-in',
    signOut: '/auth/sign-in',
    error: '/auth/sign-in', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user', // New users will be directed here on first sign in (leave the property out if not of interest)
  },

  debug: process.env.NODE_ENV === 'development',

  // Define the pretty logger
  logger: {
    debug: logger.debug.bind(logger),
    error: logger.error.bind(logger),
    warn: logger.warn.bind(logger),
  },

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      type: 'credentials',

      async authorize(credentials, _req) {
        logger.info('In credentials provider');
        // Parse credentials
        const parsedCredentials = signInSchema.safeParse(credentials);

        if (!!parsedCredentials.error) {
          return null;
        }

        try {
          const response = await axios.post<z.infer<typeof apiSignInSchema>>(
            `/auth/sign-in`,
            parsedCredentials.data,
            {
              timeout: 5000,
              timeoutErrorMessage: 'Request timed out',
              baseURL: process.env.API_URL,
            },
          );
        } catch (axiosError) {
          if (isAxiosError(axiosError)) {
            if (axiosError.response) {
              switch (axiosError.response.status) {
                case 401:
                  break;
                default:
                  // logger.error(`Could not log user in: ${axiosError.message}`);
                  console.error(`Could not log user in: ${axiosError.message}`);
                  break;
              }

              return null;
            }
          } else {
            // logger.error(`Could not log user in:`);
            console.error(`Could not log user in:`);
            // logger.error(axiosError);
            console.error(axiosError);
          }
        }

        return null; // TODO: Add credentials provider
      },

      credentials: {
        login: { label: 'Login', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
    }),
  ],

  callbacks: {
    // Default signIn callback
    async signIn(_params) {
      return true;
    },

    // Default redirect callback
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },

    // Default jwt callback
    // async jwt({ account, token, user, profile, session, trigger }) {},

    // Default session callback
    // async session({ newSession, session, token, trigger, user }) {},
  },
};
