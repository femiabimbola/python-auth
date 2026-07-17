'use client';

import { useState } from 'react';
import { Palette, Sun, Moon, Laptop } from 'lucide-react';

const themes = [
  { id: 'light', label: 'Light', icon: Sun, desc: 'Clean and bright' },
  { id: 'dark', label: 'Dark', icon: Moon, desc: 'Easy on the eyes' },
  { id: 'system', label: 'System', icon: Laptop, desc: 'Follows OS setting' },
];

export function AppearanceSection() {
  const [theme, setTheme] = useState('system');

  // TODO: Wire this up to next-themes, localStorage, or a server action
  // to persist and apply the selected theme across the app.

  return (
    <section
      id="appearance"
      className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden scroll-mt-6"
    >
      <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-pink-50 text-pink-600">
          <Palette className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Appearance</h2>
          <p className="text-sm text-slate-500">Customize how the dashboard looks for you.</p>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {themes.map((t) => (
            <label
              key={t.id}
              className={`relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 cursor-pointer transition-all
                ${theme === t.id ? 'border-pink-500 bg-pink-50/50' : 'border-slate-200 hover:border-pink-300 hover:bg-pink-50/30'}`}
            >
              <input
                type="radio"
                name="theme"
                value={t.id}
                checked={theme === t.id}
                onChange={(e) => setTheme(e.target.value)}
                className="sr-only"
              />
              <t.icon className={`w-6 h-6 ${t.id === 'dark' ? 'text-indigo-400' : 'text-amber-500'}`} />
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-900">{t.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{t.desc}</p>
              </div>
              <div
                className={`absolute top-3 right-3 w-4 h-4 rounded-full border-2 transition-colors
                  ${theme === t.id ? 'border-pink-500 bg-pink-500' : 'border-slate-300'}`}
              />
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}