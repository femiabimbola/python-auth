// frontend/src/app/(dashboard)/settings/components/danger-zone.tsx

'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { useSettingsMutations } from '../useSettingsMutations';

interface FormState {
  success: boolean;
  message?: string;
}

export function DangerZone() {
  const { deleteAccount, isDeletingAccount } = useSettingsMutations();
  const [state, setState] = useState<FormState | null>(null);

  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState(null);

    // Optional client-side confirmation check
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    if (!confirmed) return;

    const result = await deleteAccount();
    
    if (result.success) {
      // Redirect or handle post-deletion cleanup here
      window.location.href = '/login';
    } else {
      setState(result);
    }
  };

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
          <form onSubmit={handleDelete} className="flex items-center gap-3">
            {state?.message && (
              <p
                className={`text-sm ${
                  state.success ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {state.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isDeletingAccount}
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 
                rounded-xl hover:bg-red-100 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
            >
              {isDeletingAccount ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Account'
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}