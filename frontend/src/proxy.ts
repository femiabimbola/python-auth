// frontend/src/proxy.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value
  const pathname = request.nextUrl.pathname

  // Check if the current path matches any of your protected routes
  const isProtected = pathname.startsWith('/dashboard') || pathname.startsWith('/profile')

  console.log('Proxy hit:', pathname, 'Token:', !!token)

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// The config matcher itself is structurally fine, just ensure it matches your logic
export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
}