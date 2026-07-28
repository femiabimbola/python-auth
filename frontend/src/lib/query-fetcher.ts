// src/lib/query-fetcher.ts

import { ApiError } from './api-error';

export async function queryFetcher<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    credentials: 'include',
    cache: 'no-store',
  });

  const data = await res.json().catch(() => null);

  if (res.status === 401) {
    throw new ApiError('Unauthorized', 401, data);
  }

  if (!res.ok) {
    throw new ApiError(
      data?.message || 'An error occurred',
      res.status,
      data
    );
  }

  return data as T;
}