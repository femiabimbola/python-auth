// frontend/src/app/(dashboard)/settings/page.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { SettingsSidebar } from './components/settings-sidebar';
import { SettingsTabs } from './components/settings-tabs';
import { ProfileSection } from './components/profile-section';
import { SecuritySection } from './components/security-section';
import { NotificationsSection } from './components/notifications-section';
import { AppearanceSection } from './components/appearance-section';
import { DangerZone } from './components/danger-zone';
import { useSettings } from './useSettings';

export default function SettingsPage() {
  const router = useRouter();

  const {
    user,
    profile,
    isLoading,
    isProfileLoading,
    isProfileNotFound,
    error,
  } = useSettings();

  useEffect(() => {
    if (!isLoading && !user) router.replace('/login');
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-slate-500 text-sm">
        Loading settings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-600 bg-red-50 rounded-xl border border-red-200">
        <h2 className="font-bold">Failed to load settings</h2>
        <p className="text-sm mt-1">{error.message}</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen w-full bg-slate-50/50">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 md:py-12">
        <div className="mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Settings</h1>
          <p className="mt-2 text-slate-500 text-base md:text-lg">
            Manage your account settings and security preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <SettingsSidebar user={user} />

          <div className="lg:col-span-9 space-y-6">
            <SettingsTabs>
              <ProfileSection
                user={user}
                jobSeekerProfile={profile}
                isJobSeekerLoading={isProfileLoading}
                isJobSeekerNotFound={isProfileNotFound}
              />
              <SecuritySection user={user} />
              <NotificationsSection />
              <AppearanceSection />
            </SettingsTabs>

            <DangerZone />
          </div>
        </div>
      </div>
    </div>
  );
}