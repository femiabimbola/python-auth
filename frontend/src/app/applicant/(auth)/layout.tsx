
import React from 'react';
import { OrbBackground } from '@/components/OrbBackground/OrbBackground';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950">
      <OrbBackground />
      <main className="relative z-10 w-full max-w-md">
        {children}
      </main>
    </div>
  );
}