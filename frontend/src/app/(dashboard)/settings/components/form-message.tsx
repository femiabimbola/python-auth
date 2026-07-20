// frontend/src/app/%28dashboard%29/settings/components/form-message.tsx

'use client';

import { CheckCircle2, AlertCircle } from 'lucide-react';

interface FormState {
  success?: boolean;
  message?: string;
}

export function FormMessage({ state }: { state: FormState | null }) {
  if (!state?.message) return null;

  return (
    <div
      className={`flex items-center gap-1.5 text-sm ${
        state.success ? 'text-emerald-600' : 'text-red-600'
      }`}
    >
      {state.success ? (
        <CheckCircle2 className="w-4 h-4" />
      ) : (
        <AlertCircle className="w-4 h-4" />
      )}
      {state.message}
    </div>
  );
}