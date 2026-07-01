// frontend/src/app/(dashboard)/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Call THROUGH the proxy, not directly to backend
    fetch('/api/auth/users/me', {
      method: 'GET',
      credentials: 'include', // Important: sends cookies
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => setData(data))
      .catch((err) => {
        console.error(err);
        // Proxy handles 401 refresh automatically
        // If refresh fails, proxy returns 401 and clears cookies
      });
  }, []);

  return <div>{data ? JSON.stringify(data) : 'Loading...'}</div>;
}