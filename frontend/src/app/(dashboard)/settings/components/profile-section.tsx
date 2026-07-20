// frontend/src/app/%28dashboard%29/settings/components/profile-section.tsx

'use client';

import { useActionState } from 'react';
import { User, Mail, AlertCircle } from 'lucide-react';
import { updateProfile } from '../actions';
import { UserData } from '../types';
import { SubmitButton } from './submit-button';
import { FormMessage } from './form-message';

export function ProfileSection({ user }: { user: UserData }) {
  const [state, formAction] = useActionState(
    async (_prevState: unknown, formData: FormData) => updateProfile(formData),
    null
  );

  return (
    <section
      id="profile"
      className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden scroll-mt-6"
    >
      <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
          <User className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Profile Information</h2>
          <p className="text-sm text-slate-500">Update your personal details and public profile.</p>
        </div>
      </div>

      <form action={formAction} className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-sm font-medium text-slate-700">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              defaultValue={user.first_name}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 
                focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:border-slate-400"
              placeholder="Enter your first name"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className="block text-sm font-medium text-slate-700">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              defaultValue={user.last_name}
              required
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 
                focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all hover:border-slate-400"
              placeholder="Enter your last name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              id="email"
              value={user.email}
              disabled
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
            />
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Contact support to change your email address.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <FormMessage state={state} />
          <SubmitButton className="text-white bg-slate-900 hover:bg-slate-800 shadow-sm shadow-slate-900/10">
            Save Changes
          </SubmitButton>
        </div>
      </form>
    </section>
  );
}