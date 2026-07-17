// frontend/src/lib/fetch-api.ts
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function fetchApi(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;

  // 1. Prepare headers dynamically (Don't hardcode application/json)
  const headers = new Headers(options.headers);
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }
  
  // Only set JSON content type if it's not already set AND we are sending JSON
  if (!headers.has('Content-Type') && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  // 2. First attempt with current access token
  let response = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // 3. If 401, try to refresh and retry once
  if (response.status === 401 && refreshToken) {
    const refreshRes = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      
      // Attempt to set the new cookies.
      // We wrap this in a try/catch because if this runs inside page.tsx (Server Component),
      // Next.js will throw a read-only error. If it runs in actions.ts, it will succeed.
      try {
        const isProd = process.env.NODE_ENV === 'production';
        cookieStore.set('access_token', data.access_token, {
          httpOnly: true, secure: isProd, sameSite: 'lax', maxAge: 60 * 15,
        });
        if (data.refresh_token) {
          cookieStore.set('refresh_token', data.refresh_token, {
            httpOnly: true, secure: isProd, sameSite: 'lax', maxAge: 60 * 60 * 24 * 7,
          });
        }
      } catch (error) {
        // Silently ignore: We are in a Server Component. 
        // The request below will still succeed using the new token in memory.
      }

      // Retry the original request with the fresh token
      headers.set('Authorization', `Bearer ${data.access_token}`);
      response = await fetch(`${BACKEND_URL}${endpoint}`, {
        ...options,
        headers,
      });
      
    } else {
      // Refresh failed — attempt to clear cookies safely
      try {
        cookieStore.delete('access_token');
        cookieStore.delete('refresh_token');
      } catch (error) {
        // Silently ignore if in Server Component
      }
    }
  }

  return response;
}