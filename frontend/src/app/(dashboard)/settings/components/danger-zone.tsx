// frontend/src/app/%28dashboard%29/settings/components/danger-zone.tsx

'use client';

import { useActionState } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteAccount } from '../actions';
import { FormMessage } from './form-message';

export function DangerZone() {
  const [state, formAction] = useActionState(
    async (_prevState: unknown) => deleteAccount(),
    null
  );

  return (
    <section className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-red-100 bg-red-50/50 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-red-100 text-red-600">
          <Trash2 className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
          <p className="text-sm text-red-600/80">Irreversible and destructive actions.</p>
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Delete Account</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md">
              Once you delete your account, there is no going back. All your data will be permanently
              removed.
            </p>
          </div>
          <form action={formAction} className="flex items-center gap-3">
            <FormMessage state={state} />
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 
                rounded-xl hover:bg-red-100 hover:border-red-300 active:scale-[0.98] transition-all"
            >
              Delete Account
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}