// frontend/src/app/(dashboard)/dashboard/DashboardContent.tsx
'use client';

import { useRouter } from 'next/navigation';
import useSWR from 'swr';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: string;
  is_verified: boolean;
  is_active: boolean;
}

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });

  if (res.status === 401) {
    const error = new Error('Session expired. Please log in again.');
    (error as any).status = 401;
    throw error;
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Request failed: ${res.status}`);
  }

  return res.json();
};

export function DashboardContent() {
  const router = useRouter();

  const { data: user, error, isLoading } = useSWR<User>('/api/users/me', fetcher, {
    onError: (err) => {
      if (err.status === 401 || err.message.includes('Session expired')) {
        router.push('/login');
      }
    },
  });

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error && error.status !== 401) {
    return <div className="p-8 text-red-500">Error: {error.message}</div>;
  }
  if (!user) return <div className="p-8">No user data</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.full_name}</h1>
      <div className="space-y-2">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Verified:</strong> {user.is_verified ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
}