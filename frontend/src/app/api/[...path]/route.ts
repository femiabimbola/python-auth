// frontend/src/app/api/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

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

  const cookieStore = request.cookies;
  let accessToken = cookieStore.get('access_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;

  // 2. Clone incoming headers and balance the Host header
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

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000); // 30-second gateway timeout

  try {
    let response = await fetch(targetUrl, {
      method,
      headers: forwardHeaders,
      body,
      signal: controller.signal,
    });

    // 4. Handle token refresh if backend returns an authorized status
    if (response.status === 401 && refreshToken) {
      // Matches your exact FastAPI Router setup: prefix="/api/auth" + "/refresh"
      const refreshRes = await fetch(`${BACKEND_URL}/api/auth/refresh`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
        signal: controller.signal,
      });

      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        
        // Re-assign fresh authorization header
        forwardHeaders.set('Authorization', `Bearer ${refreshData.access_token}`);

        // Retry original request
        response = await fetch(targetUrl, {
          method,
          headers: forwardHeaders,
          body,
          signal: controller.signal,
        });

        // Strip troublesome hop-by-hop tracking headers
        const cleanHeaders = new Headers(response.headers);
        cleanHeaders.delete('connection');
        cleanHeaders.delete('keep-alive');
        cleanHeaders.delete('transfer-encoding');

        // Stream downstream response body back to user agent
        const proxyResponse = new NextResponse(response.body, {
          status: response.status,
          headers: cleanHeaders,
        });

        const isProd = process.env.NODE_ENV === 'production';

        proxyResponse.cookies.set('access_token', refreshData.access_token, {
          httpOnly: true,
          secure: isProd,
          sameSite: 'lax',
          maxAge: 60 * 15, // 15 minutes
        });

        // Sets rotated refresh token if issued by the service workflow
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
        // Drop bad/expired session tokens explicitly
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

    // Clean up response headers for direct proxy flow
    const cleanHeaders = new Headers(response.headers);
    cleanHeaders.delete('connection');
    cleanHeaders.delete('keep-alive');
    cleanHeaders.delete('transfer-encoding');

    clearTimeout(timeout);
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