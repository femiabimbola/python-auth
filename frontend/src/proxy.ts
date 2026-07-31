// frontend/src/proxy.ts  
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;
  const hasSession = Boolean(accessToken || refreshToken);

  const { pathname } = request.nextUrl;

  // Routes that only guests should see
  const isAuthRoute =
    pathname === '/login' || pathname === '/register' ||
    pathname.startsWith('/login/') ||
    pathname.startsWith('/register/');

  // Define protected routes
  const isProtected =
    pathname.startsWith('/dashboard') || pathname.startsWith('/settings') ||
    pathname.startsWith('/profile');

  // 1. Authenticated user hitting login/register → redirect to dashboard
  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 2. Unauthenticated user hitting protected route → redirect to login
  if (isProtected && !accessToken && !refreshToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/dashboard/:path*',
    '/settings/:path*',
    '/profile/:path*',
  ],
};