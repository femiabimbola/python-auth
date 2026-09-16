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

  const isAuthRoute =
    pathname === '/login' || 
    pathname === '/register' ||
    pathname.startsWith('/login/') ||
    pathname.startsWith('/register/') ||
    pathname.includes('/auth/login') ||
    pathname.includes('/auth/register');

  // Identify routes that must be accessible to everyone (e.g., verifying email, resetting passwords)
  const isPublicRoute = 
    pathname.includes('/auth/verify-email'); // Add /auth/forgot-password here in the future if needed

  // Route is protected ONLY if it starts with a protected prefix AND is not an auth/public route
  const isProtected = 
    (pathname.startsWith('/applicant') ||
     pathname.startsWith('/employer') ||
     pathname.startsWith('/odin')) &&
    !isAuthRoute &&
    !isPublicRoute;

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