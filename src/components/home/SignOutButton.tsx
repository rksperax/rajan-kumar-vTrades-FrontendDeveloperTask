'use client';

import React, { useTransition } from 'react';
import { Button } from '@/components/ui/Button';

interface SignOutButtonProps {
  /** Server action that clears the session and redirects. */
  signOutAction: () => Promise<void>;
}

/** Signs the user out through a server action, showing progress meanwhile. */
export const SignOutButton: React.FC<SignOutButtonProps> = ({ signOutAction }) => {
  const [isPending, startTransition] = useTransition();

  return (
    <Button onClick={() => startTransition(() => signOutAction())} loading={isPending}>
      Sign Out
    </Button>
  );
};
