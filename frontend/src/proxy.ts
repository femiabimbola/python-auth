// frontend/src/proxy.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  const { pathname } = request.nextUrl;

  // Define protected routes
  const isProtected =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/profile'); 


  /**
   * If neither token exists, the user has no authenticated session.
   * Redirect them to the login page.
   *
   * If a refresh token exists but the access token is missing or expired,
   * allow the request to continue. The API proxy (/app/api/[...path]/route.ts)
   * will automatically refresh the access token on the first API request.
   */
  if (isProtected && !accessToken && !refreshToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*', '/profile/:path*'],
};