// frontend/src/app/(dashboard)/profile/page.tsx
'use client';

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

// 1. Define a global fetcher function
const fetcher = async (url: string) => {
  const res = await fetch(url, { method: 'GET', credentials: 'include' });
  
  if (res.status === 401) {
    throw new Error('Session expired. Please log in again.');
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Request failed: ${res.status}`);
  }
  return res.json();
};

export default function ProfilePage() {
  // 2. Use the hook instead of useEffect + useState hooks
  const { data: user, error, isLoading } = useSWR<User>('/api/users/me/status', fetcher);

  // 3. Handle states cleanly (loading and error can still be rendered conditionally)
  if (isLoading) return <div className="p-8">Loading profile status...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error.message}</div>;
  if (!user) return <div className="p-8">No user profile data available.</div>;

  return (
    <div className="p-8 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4">
      <h1 className="text-2xl font-bold mb-4">Profile Status</h1>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Account Name</p>
          <p className="text-lg font-medium text-black">{user.full_name}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-500">Email Address</p>
          <p className="text-lg font-medium text-black">{user.email}</p>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm text-gray-500 mb-1">Verification Status</p>
          {user.is_verified ? (
            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
              Verified Account
            </span>
          ) : (
            <div className="space-y-2">
              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                Unverified Email
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}