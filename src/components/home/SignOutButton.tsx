'use client';

import React, { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { signOut as googleSignOut } from 'next-auth/react';

import { Button } from '@/components/ui/Button';
import { signOutRequest } from '@/lib/authApi';

interface SignOutButtonProps {
  /** True when the session came from Google rather than the JSON database. */
  isGoogleSession: boolean;
}

/** Ends whichever kind of session is active and returns to sign-in. */
export const SignOutButton: React.FC<SignOutButtonProps> = ({ isGoogleSession }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      if (isGoogleSession) {
        await googleSignOut({ redirectTo: '/auth/signin' });
        return;
      }

      await signOutRequest();
      router.replace('/auth/signin');
      router.refresh();
    });
  };

  return (
    <Button className="mt-2" onClick={handleSignOut} loading={isPending}>
      Sign Out
    </Button>
  );
};
