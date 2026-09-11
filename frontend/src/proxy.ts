// frontend/src/proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;
  const hasSession = Boolean(accessToken || refreshToken);

  const { pathname } = request.nextUrl;

  const isAuthRoute =
    pathname === '/login' || pathname === '/register' ||
    pathname.startsWith('/login/') ||
    pathname.startsWith('/register/');

  const isProtected = pathname.startsWith('/applicants') ||
    pathname.startsWith('/employer') ||
    pathname.startsWith('/odin');

  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (isProtected && !hasSession) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/login/:path*',
    '/register/:path*',
    '/applicants',
    '/applicants/:path*',
    '/employer',
    '/employer/:path*',
    '/odin',
    '/odin/:path*',
  ],
};