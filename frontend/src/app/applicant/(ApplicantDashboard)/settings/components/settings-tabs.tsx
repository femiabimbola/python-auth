// frontend/src/app/(dashboard)/settings/components/settings-tabs.tsx
'use client';

import { useState, ReactNode } from 'react';
import { User, Shield, Bell, Palette } from 'lucide-react';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
] as const;

type TabId = (typeof TABS)[number]['id'];

// NOTE: children must be passed in the exact same order as TABS above
// (Profile, Security, Notifications, Appearance) since we match them by index.
export function SettingsTabs({ children }: { children: ReactNode[] }) {
  const [active, setActive] = useState<TabId>(TABS[0].id);

  return (
    <div>
      {/* Tab bar */}
      <div className="border-b border-slate-200 mb-6 overflow-x-auto">
        <nav className="flex gap-1 min-w-max" aria-label="Settings tabs">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActive(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab panels — rendered once, toggled via CSS so form state inside
          each section isn't lost when switching tabs */}
      <div>
        {TABS.map((tab, i) => (
          <div
            key={tab.id}
            role="tabpanel"
            hidden={active !== tab.id}
            className={active === tab.id ? 'block' : 'hidden'}
          >
            {children[i]}
          </div>
        ))}
      </div>
    </div>
  );
}