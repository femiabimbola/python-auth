// frontend/src/app/api/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

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
  // 1. Build downstream URL, ensuring the /api prefix is preserved for your FastAPI backend
  const backendPath = `/api/${pathSegments.join('/')}`;
  const searchParams = request.nextUrl.search;
  const targetUrl = `${BACKEND_URL}${backendPath}${searchParams}`;

  // Read cookies from incoming frontend request
  const cookieStore = request.cookies;
  let accessToken = cookieStore.get('access_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;

  // 2. Clone incoming headers and balance the Host header to prevent CORS/Host mismatches
  const forwardHeaders = new Headers(request.headers);
  forwardHeaders.set('host', new URL(BACKEND_URL).host);
  if (accessToken) {
    forwardHeaders.set('Authorization', `Bearer ${accessToken}`);
  }

  // 3. Extract request body as an ArrayBuffer to remain stream-friendly and upload-safe
  let body: ArrayBuffer | undefined = undefined;
  if (method !== 'GET' && method !== 'DELETE') {
    body = await request.arrayBuffer();
  }

  // Enforce a strict gateway timeout for downstream microservices
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    let response = await fetch(targetUrl, {
      method,
      headers: forwardHeaders,
      body,
      signal: controller.signal,
    });

    // 4. Handle token refresh automatically if backend returns a 401 Unauthorized status
    if (response.status === 401 && refreshToken) {
      const refreshRes = await fetch(`${BACKEND_URL}/api/auth/refresh`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
        signal: controller.signal,
      });

      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        
        // Retry original target request with the fresh token
        forwardHeaders.set('Authorization', `Bearer ${refreshData.access_token}`);
        response = await fetch(targetUrl, {
          method,
          headers: forwardHeaders,
          body,
          signal: controller.signal,
        });

        // Strip hop-by-hop HTTP headers before forwarding back to client
        const cleanHeaders = new Headers(response.headers);
        cleanHeaders.delete('connection');
        cleanHeaders.delete('keep-alive');
        cleanHeaders.delete('transfer-encoding');

        const proxyResponse = new NextResponse(response.body, {
          status: response.status,
          headers: cleanHeaders,
        });

        const isProd = process.env.NODE_ENV === 'production';

        // Persist newly rotated tokens in secure HttpOnly cookies
        proxyResponse.cookies.set('access_token', refreshData.access_token, {
          httpOnly: true,
          secure: isProd,
          sameSite: 'lax',
          maxAge: 60 * 15, // 15 minutes
        });

        if (refreshData.refresh_token) {
          proxyResponse.cookies.set('refresh_token', refreshData.refresh_token, {
            httpOnly: true,
            secure: isProd,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
          });
        }

        clearTimeout(timeout);
        return proxyResponse;
      } else {
        // Clear expired credentials explicitly if refresh request fails
        const errorResponse = NextResponse.json(
          { detail: 'Session expired. Please log in again.' },
          { status: 401 }
        );
        errorResponse.cookies.delete('access_token');
        errorResponse.cookies.delete('refresh_token');
        clearTimeout(timeout);
        return errorResponse;
      }
    }

    // Clean up proxy tracking and transport headers
    const cleanHeaders = new Headers(response.headers);
    cleanHeaders.delete('connection');
    cleanHeaders.delete('keep-alive');
    cleanHeaders.delete('transfer-encoding');

    clearTimeout(timeout);

    // Intercept successful logins to extract response data and set browser cookies
    const isLoginPath = pathSegments.join('/') === 'auth/login';
    if (response.ok && isLoginPath) {
      const responseClone = response.clone();
      try {
        const loginData = await responseClone.json();
        const proxyResponse = new NextResponse(response.body, {
          status: response.status,
          headers: cleanHeaders,
        });

        const isProd = process.env.NODE_ENV === 'production';

        // Set access and refresh tokens as HttpOnly cookies for subsequent requests/middleware
        if (loginData.access_token) {
          proxyResponse.cookies.set('access_token', loginData.access_token, {
            httpOnly: true,
            secure: isProd,
            sameSite: 'lax',
            maxAge: 15 * 60,
          });
        }

        if (loginData.refresh_token) {
          proxyResponse.cookies.set('refresh_token', loginData.refresh_token, {
            httpOnly: true,
            secure: isProd,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60,
          });
        }

        return proxyResponse;
      } catch (e) {
        console.error("Failed to inject login cookies in proxy:", e);
      }
    }

    // Return direct stream back to user agent for ordinary proxy paths
    return new NextResponse(response.body, {
      status: response.status,
      headers: cleanHeaders,
    });

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