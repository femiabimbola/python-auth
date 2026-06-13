import React from 'react';
import { OrbBackground } from '@/components/OrbBackground/OrbBackground';


interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* 1. The background element */}
      <OrbBackground />
      {/* 2. The page content (Login / Register forms) */}
      <main style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </main>
    </div>
  );
}