'use client';

import useSWR from 'swr';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface DashboardData {
  // Define your data shape
  user: { name: string; email: string };
  stats: { total: number; active: number };
}

// Custom fetcher that handles auto-refresh on 401
const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (res.status === 401) {
    // Try to refresh the token
    const refreshRes = await fetch('/api/auth/refresh', { method: 'POST' });

    if (refreshRes.ok) {
      // Retry the original request with new cookies (auto-sent by browser)
      const retryRes = await fetch(url);
      if (!retryRes.ok) throw new Error('Failed after refresh');
      return retryRes.json();
    } else {
      // Refresh failed — session expired
      throw new Error('SESSION_EXPIRED');
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || 'Request failed');
  }

  return res.json();
};

export default function DashboardPage() {
  const router = useRouter();

  const { data, error, isLoading } = useSWR<DashboardData>(
    '/api/proxy/dashboard/data',
    fetcher,
    {
      // Don't revalidate on focus to avoid unnecessary requests
      revalidateOnFocus: false,
      // Retry failed requests
      shouldRetryOnError: (err: any) => err.message !== 'SESSION_EXPIRED',
    }
  );

  // Handle session expiration
  useEffect(() => {
    if (error?.message === 'SESSION_EXPIRED') {
      router.push('/login');
    }
  }, [error, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error && error.message !== 'SESSION_EXPIRED') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}