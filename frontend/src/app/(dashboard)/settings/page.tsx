import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { UserData } from './types';
import { SettingsSidebar } from './components/settings-sidebar';
import { ProfileSection } from './components/profile-section';
import { SecuritySection } from './components/security-section';
import { NotificationsSection } from './components/notifications-section';
import { AppearanceSection } from './components/appearance-section';
import { DangerZone } from './components/danger-zone';
import { fetchApi } from '@/lib/fetch-api';

async function getUser(): Promise<UserData | null> {
  try {
    const res = await fetchApi('/api/users/me', { cache: 'no-store' });

    if (res.status === 401) return null;
    if (!res.ok) return null;

    return await res.json();
  } catch (err) {
    console.error('Server-side settings load failed:', err);
    return null;
  }
}

export default async function SettingsPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

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