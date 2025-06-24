import type {
  MiddlewareConfig,
  NextFetchEvent,
  NextRequest,
} from 'next/server';
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequestWithAuth } from 'next-auth/middleware';
import authMiddleware from 'next-auth/middleware';

import { logger as globalLogger } from './_shared/utils/logger';
import { findPageConfig } from './modules/auth/lib/page-manifest';
import { middlewareAuthOptions } from './modules/auth/modules/next-auth/middleware-auth.options';

const logger = globalLogger.child({
  name: 'Middleware',
});

const debugEnabled = process.env.NODE_ENV === 'development';

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  // Get requested url
  const url = req.nextUrl.clone();
  const { pathname } = url;

  // Get page auth configuration
  const pageConfig = findPageConfig(pathname);

  // Skip ignored routes by the auth system
  if (pageConfig === null || !pageConfig.pageAccess) {
    if (debugEnabled) {
      logger.debug(`Ignore running middleware for ${pathname}.`);
    }

    // Skip
    return NextResponse.next();
  }

  // Debug
  if (debugEnabled) {
    logger.debug(`Running middleware for ${pathname}...`);
  }

  // Check authentication
  let response = await authMiddleware(
    (_authRequest, _event) => {},
    middlewareAuthOptions,
  )(req as NextRequestWithAuth, event);

  // Check if the auth middleware has modified the response
  if (!response) {
    // Check the authorization for the requested page
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (token) {
      // If only requires to be authenticated
      if (
        !Array.isArray(pageConfig.pageAccess?.grants) ||
        (pageConfig.pageAccess.grants ?? []).length === 0
      ) {
        response = NextResponse.next();
      } else if (pageConfig.pageAccess.mode === 'any') {
        // Check if the logged user has any of the required grants
        const hasOneGrant = pageConfig.pageAccess.grants.some((grant) =>
          token.grants.includes(grant),
        );
        if (hasOneGrant) {
          response = NextResponse.next();
        } else {
          response = NextResponse.redirect(new URL('/dashboard', req.url));
        }
      } else {
        // Mode is set to `all`
        const hasAllGrants = pageConfig.pageAccess.grants.every((grant) =>
          token.grants.includes(grant),
        );
        if (hasAllGrants) {
          response = NextResponse.next();
        } else {
          response = NextResponse.redirect(new URL('/dashboard', req.url));
        }
      }
    } else {
      response = NextResponse.redirect(new URL('/auth/signin', req.url));
    }
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
