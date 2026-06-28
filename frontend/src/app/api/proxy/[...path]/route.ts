import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, 'GET', (await params).path);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, 'POST', (await params).path);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, 'PUT', (await params).path);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, 'DELETE', (await params).path);
}

async function proxyRequest(
  request: NextRequest,
  method: string,
  pathSegments: string[]
) {
  const path = pathSegments.join('/');
  const cookieStore = request.cookies;
  let accessToken = cookieStore.get('access_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;

  const body =
    method !== 'GET' && method !== 'DELETE'
      ? await request.text()
      : undefined;

  // First attempt with current access token
  let response = await fetch(`${BACKEND_URL}/${path}`, {
    method,
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body } : {}),
  });

  // If 401, try to refresh the token
  if (response.status === 401 && refreshToken) {
    const refreshRes = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (refreshRes.ok) {
      const refreshData = await refreshRes.json();

      // Retry original request with new access token
      accessToken = refreshData.access_token;
      response = await fetch(`${BACKEND_URL}/${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          ...(body ? { 'Content-Type': 'application/json' } : {}),
        },
        ...(body ? { body } : {}),
      });

      // Forward response with updated cookies
      const responseData = await response.text();
      const proxyResponse = new NextResponse(responseData, {
        status: response.status,
        headers: {
          'Content-Type':
            response.headers.get('Content-Type') || 'application/json',
        },
      });

      // Set new cookies
      proxyResponse.cookies.set('access_token', refreshData.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 30, // 15 minutes
      });

      if (refreshData.refresh_token) {
        proxyResponse.cookies.set('refresh_token', refreshData.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });
      }

      return proxyResponse;
    } else {
      // Refresh failed — clear cookies and return 401
      const errorResponse = NextResponse.json(
        { detail: 'Session expired. Please log in again.' },
        { status: 401 }
      );
      errorResponse.cookies.delete('access_token');
      errorResponse.cookies.delete('refresh_token');
      return errorResponse;
    }
  }

  // Forward response as-is (no refresh needed)
  const responseData = await response.text();
  return new NextResponse(responseData, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'application/json',
    },
  });
}