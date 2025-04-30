import type {
  MiddlewareConfig,
  NextFetchEvent,
  NextRequest,
} from 'next/server';
import { NextResponse } from 'next/server';
import type { NextRequestWithAuth } from 'next-auth/middleware';
import authMiddleware from 'next-auth/middleware';
import { pathToRegexp } from 'path-to-regexp';

import { logger as globalLogger } from './_shared/utils/logger';
import { middlewareAuthOptions } from './modules/auth/modules/next-auth/middleware-auth.options';

const logger = globalLogger.child({
  name: 'Middleware',
});

const debugEnabled = process.env.NODE_ENV === 'development';

const authIgnoredRoutes = [
  {
    route: '/',
    regex: pathToRegexp('/').regexp,
  },
];

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  // Get requested url
  const url = req.nextUrl.clone();

  // Skip ignored routes by the auth system
  if (authIgnoredRoutes.some(({ regex }) => regex.test(url.pathname))) {
    if (debugEnabled) {
      logger.debug(`Ignore running middleware for ${url.pathname}.`);
    }

    // Skip
    return NextResponse.next();
  }

  // Debug
  if (debugEnabled) {
    logger.debug(`Running middleware for ${url.pathname}...`);
  }

  // Check authentication
  let response = await authMiddleware(
    (_authRequest, _event) => {},
    middlewareAuthOptions,
  )(req as NextRequestWithAuth, event);

  // Check if the auth middleware has modified the response
  if (!response) {
    response = NextResponse.next();
  }

  // Return processed response
  return response;
}

export const config: MiddlewareConfig & { runtime?: 'nodejs' } = {
  matcher: [
    '/((?!api|auth|static|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],

  runtime: 'nodejs',
};
