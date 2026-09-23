import React from 'react';
import { AuthSidePanel } from '@/components/auth/AuthSidePanel';

/** Two-column shell for the auth screens; the side panel is hidden on small viewports. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center gap-8 bg-background p-4 lg:p-8">
      <div className="hidden h-[calc(100vh-4rem)] flex-1 lg:block">
        <AuthSidePanel />
      </div>
      <div className="flex w-full flex-1 flex-col items-center justify-center">{children}</div>
    </div>
  );
}
