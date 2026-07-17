'use client';

import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  pendingText?: string;
}

export function SubmitButton({
  children,
  pendingText = 'Saving…',
  className = '',
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl
        transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {pending && <Loader2 className="w-4 h-4 animate-spin" />}
      {pending ? pendingText : children}
    </button>
  );
}