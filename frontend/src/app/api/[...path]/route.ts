// frontend/src/app/api/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

const AUTH_COOKIE_BASE = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
} as const;

// Helper function to resolve the dynamic path segments asynchronously
async function extractPath(params: Promise<{ path: string[] }>) {
  return (await params).path;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    return await proxyRequest(request, 'GET', await extractPath(params));
  } catch (err) {
    return NextResponse.json({ detail: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    return await proxyRequest(request, 'POST', await extractPath(params));
  } catch (err) {
    return NextResponse.json({ detail: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    return await proxyRequest(request, 'PUT', await extractPath(params));
  } catch (err) {
    return NextResponse.json({ detail: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    return await proxyRequest(request, 'DELETE', await extractPath(params));
  } catch (err) {
    return NextResponse.json({ detail: 'Internal Server Error' }, { status: 500 });
  }
}


async function proxyRequest(request: NextRequest, method: string, pathSegments: string[]) {
  // 1. Build downstream URL, preserving the /api prefix for the FastAPI backend
  const backendPath = `/api/${pathSegments.join('/')}`;
  const searchParams = request.nextUrl.search;
  const targetUrl = `${BACKEND_URL}${backendPath}${searchParams}`;

  const pathKey = pathSegments.join('/');
  const isLoginPath = pathKey === 'auth/login';
  const isLogoutPath = pathKey === 'auth/logout'; // NEW

  // Read cookies from incoming frontend request
  const cookieStore = request.cookies;
  const accessToken = cookieStore.get('access_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;

  // 2. Clone incoming headers and rebalance Host to prevent CORS/Host mismatches
  const forwardHeaders = new Headers(request.headers);
  forwardHeaders.set('host', new URL(BACKEND_URL).host);
  if (accessToken) {
    forwardHeaders.set('Authorization', `Bearer ${accessToken}`);
  }

  // 3. Extract request body as ArrayBuffer (stream-friendly, upload-safe)
  let body: ArrayBuffer | undefined;
  if (method !== 'GET' && method !== 'DELETE') {
    body = await request.arrayBuffer();
  }

  // NEW --------------------------------------------------------------------
  // The refresh_token lives in an HttpOnly cookie, so the browser cannot read
  // it to build the logout body that FastAPI's RefreshRequest demands. Inject
  // it server-side. Sending '' when the cookie is absent is safe: verify_token
  // no-ops on invalid tokens, so logout stays idempotent.
  if (isLogoutPath) {
    const encoded = new TextEncoder().encode(
      JSON.stringify({ refresh_token: refreshToken ?? '' })
    );
    body = encoded.buffer as ArrayBuffer;
    forwardHeaders.set('content-type', 'application/json');
    // The incoming bodyless POST carried "Content-Length: 0" (or none);
    // replace it so the backend reads the injected body instead of 0 bytes.
    forwardHeaders.delete('content-length');
    forwardHeaders.set('content-length', String(encoded.byteLength));
  }
  // -------------------------------------------------------------------------

  // Enforce a strict gateway timeout for downstream microservices
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    let response = await fetch(targetUrl, {
      method,
      headers: forwardHeaders,
      body,
      signal: controller.signal,
    });

    // 4. Auto-refresh once on 401, then retry the original request
    if (response.status === 401 && refreshToken) {
      const refreshRes = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
        signal: controller.signal,
      });

      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();

        forwardHeaders.set('Authorization', `Bearer ${refreshData.access_token}`);
        response = await fetch(targetUrl, {
          method,
          headers: forwardHeaders,
          body,
          signal: controller.signal,
        });

        const proxyResponse = buildProxyResponse(response);

        // Persist newly rotated tokens in secure HttpOnly cookies
        proxyResponse.cookies.set('access_token', refreshData.access_token, {
          ...AUTH_COOKIE_BASE,
          maxAge: 60 * 5, // 5 minutes
        });
        if (refreshData.refresh_token) {
          proxyResponse.cookies.set('refresh_token', refreshData.refresh_token, {
            ...AUTH_COOKIE_BASE,
            maxAge: 60 * 60 * 24 * 7, // 7 days
          });
        }

        clearTimeout(timeout);
        return proxyResponse;
      }

      // Refresh failed → session is dead, clear credentials explicitly
      const errorResponse = NextResponse.json(
        { detail: 'Session expired. Please log in again.' },
        { status: 401 }
      );
      errorResponse.cookies.set('access_token', '', { ...AUTH_COOKIE_BASE, maxAge: 0 });
      errorResponse.cookies.set('refresh_token', '', { ...AUTH_COOKIE_BASE, maxAge: 0 });
      clearTimeout(timeout);
      return errorResponse;
    }

    clearTimeout(timeout);

    // NEW --------------------------------------------------------------------
    // Successful logout: expire both cookies so the browser stops sending the
    // revoked refresh token AND the still-valid access token.
    if (isLogoutPath && response.ok) {
      const proxyResponse = buildProxyResponse(response);
      proxyResponse.cookies.set('access_token', '', { ...AUTH_COOKIE_BASE, maxAge: 0 });
      proxyResponse.cookies.set('refresh_token', '', { ...AUTH_COOKIE_BASE, maxAge: 0 });
      return proxyResponse;
    }
    // -------------------------------------------------------------------------

    // Intercept successful logins → extract tokens → set browser cookies
    if (response.ok && isLoginPath) {
      try {
        const loginData = await response.clone().json();
        const proxyResponse = buildProxyResponse(response);

        if (loginData.access_token) {
          proxyResponse.cookies.set('access_token', loginData.access_token, {
            ...AUTH_COOKIE_BASE,
            maxAge: 15 * 60, // 15 minutes
          });
        }
        if (loginData.refresh_token) {
          proxyResponse.cookies.set('refresh_token', loginData.refresh_token, {
            ...AUTH_COOKIE_BASE,
            maxAge: 7 * 24 * 60 * 60, // 7 days
          });
        }

        return proxyResponse;
      } catch (e) {
        console.error('Failed to inject login cookies in proxy:', e);
        // fall through to the plain proxied response
      }
    }

    // Ordinary proxy path: stream straight back to the user agent
    return buildProxyResponse(response);
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof Error && err.name === 'AbortError') {
      return NextResponse.json(
        { detail: 'Request timeout. Backend did not respond in time.' },
        { status: 504 }
      );
    }
    throw err;
  }
}

// Strip hop-by-hop HTTP headers before forwarding a backend response to the client
function buildProxyResponse(response: Response): NextResponse {
  const cleanHeaders = new Headers(response.headers);
  cleanHeaders.delete('connection');
  cleanHeaders.delete('keep-alive');
  cleanHeaders.delete('transfer-encoding');
  return new NextResponse(response.body, {
    status: response.status,
    headers: cleanHeaders,
  });
}