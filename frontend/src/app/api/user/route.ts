// frontend/src/app/api/auth/user/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ detail: 'Not authenticated' }, { status: 401 });
  }

  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      // Clear invalid cookies on 401
      if (backendRes.status === 401) {
        const response = NextResponse.json(data, { status: 401 });
        response.cookies.delete('access_token');
        response.cookies.delete('refresh_token');
        return response;
      }
      return NextResponse.json(data, { status: backendRes.status });
    }

    return NextResponse.json(data);

  } catch {
    return NextResponse.json(
      { detail: 'Failed to connect to authentication server' },
      { status: 500 }
    );
  }
}