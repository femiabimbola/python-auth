// frontend/src/lib/fetch-api.ts

import { cookies } from 'next/headers';

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function fetchApi(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const cookieStore = await cookies();

  // Forward the browser cookies to the Next.js proxy.
  // The proxy will read the access/refresh tokens from these cookies.
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ');

  const headers = new Headers(options.headers);

  if (cookieHeader) {
    headers.set('Cookie', cookieHeader);
  }

  return fetch(`${APP_URL}${endpoint}`, {
    ...options,
    headers,
    cache: options.cache,
  });
}