// frontend/src/app/(dashboard)/settings/components/security-section.tsx

'use client';

import { useState, useRef } from 'react';
import {
  KeyRound,
  Fingerprint,
  Smartphone,
  Globe,
  Laptop,
  LogOut,
  Loader2,
} from 'lucide-react';
import { UserData } from '../types';
import { useSettingsMutations } from '../useSettingsMutations';

interface FormState {
  success: boolean;
  message: string;
}

export function SecuritySection({ user }: { user: UserData }) {
  const { updatePassword, isUpdatingPassword } = useSettingsMutations();
  const [passwordState, setPasswordState] = useState<FormState | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordState(null);

    const formData = new FormData(e.currentTarget);
    const result = await updatePassword(formData);

    setPasswordState(result);

    // Reset password fields on success
    if (result?.success && formRef.current) {
      formRef.current.reset();
    }
  };

  return (
    <section
      id="security"
      className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden scroll-mt-6"
    >
      <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-violet-50 text-violet-600">
          <KeyRound className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Security</h2>
          <p className="text-sm text-slate-500">Manage your password and authentication methods.</p>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Change Password Form */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-slate-400" />
            Change Password
          </h3>
          <form ref={formRef} onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  required
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  required
                  minLength={8}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                  placeholder="Min. 8 characters"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              {passwordState && (
                <p
                  className={`text-sm ${
                    passwordState.success ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {passwordState.message}
                </p>
              )}

              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
              >
                {isUpdatingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </button>
            </div>
          </form>
        </div>

        <hr className="border-slate-100" />

        {/* Two-Factor Authentication */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <div className="p-2 rounded-lg bg-slate-100 text-slate-600 mt-0.5">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Two-Factor Authentication</h3>
              <p className="text-sm text-slate-500 mt-0.5 max-w-md">
                Add an extra layer of security to your account by requiring a verification code in addition to your password.
              </p>
            </div>
          </div>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-xl border transition-all shrink-0 ${
              user.two_factor_enabled
                ? 'border-red-200 text-red-600 hover:bg-red-50'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {user.two_factor_enabled ? 'Disable' : 'Enable'}
          </button>
        </div>

        <hr className="border-slate-100" />

        {/* Active Sessions */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-slate-400" />
            Active Sessions
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200/60">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Laptop className="w-4 h-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Current Session</p>
                  <p className="text-xs text-slate-500">Chrome on macOS • Active now</p>
                </div>
              </div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/50">
                Active
              </span>
            </div>
          </div>

          <div className="mt-3">
            <button
              type="button"
              className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out all other sessions
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}