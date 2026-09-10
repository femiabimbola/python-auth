'use server';

import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

/**
 * Server-side fetch with automatic token refresh.
 * Use this in Server Components and API routes.
 */
export async function authFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;

  // First attempt with current access token
  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      'Content-Type': 'application/json',
    },
  });

  // If 401, try to refresh and retry once
  if (response.status === 401 && refreshToken) {
    const refreshed = await refreshAccessToken(refreshToken);

    if (refreshed.success) {
      // Retry the original request with new token
      return fetch(`${BACKEND_URL}${endpoint}`, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${refreshed.accessToken}`,
          'Content-Type': 'application/json',
        },
      });
    } else {
      // Refresh failed — clear cookies
      cookieStore.delete('access_token');
      cookieStore.delete('refresh_token');
    }
  }

  return response;
}

async function refreshAccessToken(refreshToken: string): Promise<{
  success: boolean;
  accessToken?: string;
}> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) {
      return { success: false };
    }

    const data = await res.json();

    // We can't set cookies from a server function directly in the same way
    // So we return the token and let the caller handle it
    // Actually, better approach: use the API route for refresh

    return { success: true, accessToken: data.access_token };
  } catch {
    return { success: false };
  }
}