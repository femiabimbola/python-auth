// frontend/src/proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;
  
  const isTokenValid = (token?: string) => 
    Boolean(token && token !== 'null' && token !== 'undefined' && token !== '');
    
  const hasSession = isTokenValid(accessToken) || isTokenValid(refreshToken);

  const { pathname } = request.nextUrl;

  // Identify all guest-only auth routes (including nested ones like /applicant/auth/login)
  const isAuthRoute =
    pathname === '/login' || 
    pathname === '/register' ||
    pathname.startsWith('/login/') ||
    pathname.startsWith('/register/') ||
    pathname.includes('/auth/login') ||
    pathname.includes('/auth/register');

  // Route is protected ONLY if it starts with a protected prefix AND is not an auth route
  const isProtected = 
    (pathname.startsWith('/applicant') ||
     pathname.startsWith('/employer') ||
     pathname.startsWith('/odin')) &&
    !isAuthRoute;

  // 1. Authenticated user hitting login/register → send to dashboard
  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL('/applicant/dashboard', request.url));
  }

  // 2. Unauthenticated user hitting protected route → send to login
  if (isProtected && !hasSession) {
    return NextResponse.redirect(new URL('/applicant/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/login/:path*',
    '/register/:path*',
    '/applicant',
    '/applicant/:path*',
    '/employer',
    '/employer/:path*',
    '/odin',
    '/odin/:path*',
  ],
};