'use client';

import { useActionState } from 'react';
import {
  KeyRound,
  Fingerprint,
  Smartphone,
  Globe,
  Laptop,
  LogOut,
} from 'lucide-react';
import { updatePassword } from '../actions';
import { UserData } from '../types';
import { SubmitButton } from './submit-button';
import { FormMessage } from './form-message';

export function SecuritySection({ user }: { user: UserData }) {
  const [passwordState, passwordAction] = useActionState(
    async (_prevState: unknown, formData: FormData) => updatePassword(formData),
    null
  );

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
        {/* Change Password */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-slate-400" />
            Change Password
          </h3>
          <form action={passwordAction} className="space-y-4">
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
            <div className="flex justify-end gap-3">
              <FormMessage state={passwordState} />
              <SubmitButton className="text-white bg-violet-600 hover:bg-violet-700 shadow-sm shadow-violet-600/10">
                Update Password
              </SubmitButton>
            </div>
          </form>
        </div>

        <hr className="border-slate-100" />

        {/* Two Factor Auth */}
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <div className="p-2 rounded-lg bg-slate-100 text-slate-600 mt-0.5">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Two-Factor Authentication</h3>
              <p className="text-sm text-slate-500 mt-0.5 max-w-md">
                Add an extra layer of security to your account by requiring a verification code in
                addition to your password.
              </p>
            </div>
          </div>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-xl border transition-all ${
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
                  <p className="text-xs text-slate-500">Chrome on macOS • IP 192.168.1.1</p>
                </div>
              </div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                Active Now
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