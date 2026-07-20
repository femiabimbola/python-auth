// frontend/src/app/(dashboard)/settings/page.tsx

import { redirect } from 'next/navigation';
import {  GetUserResult } from './types';
import { SettingsSidebar } from './components/settings-sidebar';
import { ProfileSection } from './components/profile-section';
import { SecuritySection } from './components/security-section';
import { NotificationsSection } from './components/notifications-section';
import { AppearanceSection } from './components/appearance-section';
import { DangerZone } from './components/danger-zone';
import { fetchApi } from '@/lib/fetch-api';

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
    <div className="min-h-screen w-full bg-slate-50/50">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Settings</h1>
          <p className="mt-2 text-slate-500 text-base md:text-lg">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* TypeScript is happy now because `user` is explicitly `UserData` */}
          <SettingsSidebar user={user} />

          <div className="lg:col-span-9 space-y-6">
            <ProfileSection user={user} />
            <SecuritySection user={user} />
            <NotificationsSection />
            <AppearanceSection />
            <DangerZone />
          </div>
        </div>
      </div>
    </div>
  );
}