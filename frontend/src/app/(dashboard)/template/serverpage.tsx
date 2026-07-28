// frontend/src/app/(dashboard)/settings/page.tsx


import { redirect } from 'next/navigation';
import { fetchApi } from '@/lib/fetch-api';
import { SettingsSidebar } from './components/settings-sidebar';
import { GetUserResult } from './types';

async function getUser(): Promise<GetUserResult> {
  try {
    const res = await fetchApi('/api/users/me', { cache: 'no-store' });

    if (res.status === 401) {
      return { success: false, error: 'unauthorized', message: 'You are not authorized to view this page.' };
    }
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return {
        success: false, error: 'unknown',
        message: body.detail || `HTTP ${res.status}`,
      };
    }

      const data = await res.json().catch(() => {
      throw new Error('parse');
    });

    return { success: true, data };
  } catch (err) {
    const errorType = err instanceof Error && err.message === 'parse' ? 'parse' : 'network';
    return {
      success: false,
      error: errorType,
      message: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}


export default async function SettingsPage() {
  const result = await getUser();

  // 1. Handle unauthorized/logged-out states by redirecting
  if (!result.success && result.error === 'unauthorized') {
    redirect('/login');
  }

  // 2. Handle server/network errors (render an error state or let an error boundary catch it)
  if (!result.success) {
    return (
      <div className="p-8 text-red-600 bg-red-50 rounded-md">
        <h2 className="font-bold">Failed to load settings</h2>
        <p>{result.message}</p>
      </div>
    );
  }

  // 3. Extract the clean UserData safely now that success is true
  const user = result.data;

  return (
  <SettingsSidebar user={user} />
  );
}