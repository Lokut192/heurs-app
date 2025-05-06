// Middleware NextAuthOptions
import { jwtDecode } from 'jwt-decode';
import type { NextAuthMiddlewareOptions } from 'next-auth/middleware';

import { logger as globalLogger } from '@/_shared/utils/logger';

import { authOptions } from './auth.options';

const logger = globalLogger.child({
  name: 'NextAuthMiddleware',
});

const debugEnabled = process.env.NODE_ENV === 'development';

export const middlewareAuthOptions: NextAuthMiddlewareOptions = {
  pages: authOptions.pages,

  secret: authOptions.secret,

  callbacks: {
    async authorized({ token }) {
      if (!token) {
        if (debugEnabled) {
          logger.debug('Unauthorized');
        }
        return false;
      }

      // Recover auth tokens
      const { accessToken, refreshToken } = token;

      // Check their integrity
      if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
        if (debugEnabled) {
          logger.debug('Unauthorized');
        }
        return false;
      }

      // Decode tokens
      const [decodedAccessToken, decodedRefreshToken] = [
        jwtDecode(accessToken),
        jwtDecode(refreshToken),
      ];
      const { exp: accessTokenExp } = decodedAccessToken;
      const { exp: refreshTokenExp } = decodedRefreshToken;

      if (!accessTokenExp || !refreshTokenExp) {
        return false;
      }

      // Check their validity
      const accessTokenExpired = accessTokenExp * 1000 < Date.now();
      const refreshTokenExpired = refreshTokenExp * 1000 < Date.now();

      if (accessTokenExpired || refreshTokenExpired) {
        if (debugEnabled) {
          logger.debug('Unauthorized');
        }
        return false;
      }

      return true;
    },
  },
};
