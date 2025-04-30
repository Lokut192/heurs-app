import axios, { isAxiosError } from 'axios';
import type { AuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type z from 'zod';

import { logger as globalLogger } from '@/_shared/utils/logger';

import { apiGetMeSchema } from '../../schemas/api-get-me.schema';
import { apiSignInSchema } from '../../schemas/api-sign-in.schema';
import { signInSchema } from '../../schemas/sign-in.schema';

const logger = globalLogger.child({
  // module: 'next-auth',
  name: 'NextAuth',
});

const debugEnabled = process.env.NODE_ENV === 'development';

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

  debug: debugEnabled,

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
        // Parse credentials
        const parsedCredentials = signInSchema.safeParse(credentials);

        if (!!parsedCredentials.error) {
          return null;
        }

        try {
          if (debugEnabled) {
            logger.debug(`Logging user ${parsedCredentials.data.login} in...`);
          }

          // Sign user in
          const signInRes = await axios.post<z.infer<typeof apiSignInSchema>>(
            `/auth/sign-in`,
            parsedCredentials.data,
            {
              timeout: 5000,
              timeoutErrorMessage: 'Request timed out',
              baseURL: process.env.API_URL,
            },
          );

          // Check sign in payload schema
          const parsedSignInData = apiSignInSchema.safeParse(signInRes.data);

          // Process eventual errors
          if (!!parsedSignInData.error) {
            if (debugEnabled) {
              logger.error(
                `API returned invalid data on sign in: ${parsedSignInData.error.message}`,
              );
            }

            return null;
          }

          // Get current user data
          const getMeRes = await axios.get<z.infer<typeof apiGetMeSchema>>(
            `/me`,
            {
              timeout: 5000,
              timeoutErrorMessage: 'Request timed out',
              baseURL: process.env.API_URL,
              headers: {
                Authorization: `Bearer ${parsedSignInData.data.accessToken}`,
              },
            },
          );

          // Check get me payload schema
          const parsedMeData = apiGetMeSchema.safeParse(getMeRes.data);

          // Process eventual errors
          if (!!parsedMeData.error) {
            if (debugEnabled) {
              logger.error(
                `API returned invalid data on get me: ${parsedMeData.error.message}`,
              );
            }

            return null;
          }

          const sessionUser: User = {
            id: parsedMeData.data.id,
            email: parsedMeData.data.email,
            name: parsedMeData.data.username,
            username: parsedMeData.data.username,
            accessToken: parsedSignInData.data.accessToken,
            refreshToken: parsedSignInData.data.refreshToken,
          };

          if (debugEnabled) {
            logger.debug(
              `Successfully logged user ${parsedCredentials.data.login} in:`,
            );
            logger.debug(
              '\n' +
                JSON.stringify(
                  {
                    id: sessionUser.id,
                    email: sessionUser.email,
                    username: sessionUser.username,
                  },
                  null,
                  2,
                ),
            );
          }

          return sessionUser;
        } catch (axiosError) {
          if (isAxiosError(axiosError)) {
            if (axiosError.response) {
              switch (axiosError.response.status) {
                case 401:
                  if (debugEnabled) {
                    logger.error(
                      `Credentials invalid, could not log user ${parsedCredentials.data.login} in.`,
                    );
                  }
                  break;
                default:
                  logger.error(`Could not log user in: ${axiosError.message}`);
                  break;
              }

              return null;
            }
          } else {
            logger.error(`Could not log user in:`);
            logger.error(axiosError);
          }
        }

        return null;
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
    async jwt({ token, user, trigger }) {
      switch (trigger) {
        case 'signIn':
          if (user) {
            token.id = +user.id;
            token.email = user.email;
            token.name = user.name;
            token.username = user.username;
            token.accessToken = user.accessToken;
            token.refreshToken = user.refreshToken;
          }
          break;
        case 'update':
        default:
          break;
      }
      return token;
    },

    // Default session callback
    // async session({ newSession, session, token, trigger, user }) {},
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email ?? '';
        session.user.name = token.name ?? '';
        session.user.username = token.username ?? '';
        session.user.accessToken = token.accessToken ?? '';
        session.user.refreshToken = token.refreshToken ?? '';
      }
      return session;
    },
  },
};
