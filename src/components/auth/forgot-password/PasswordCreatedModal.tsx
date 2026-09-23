import React from 'react';
import Image from 'next/image';
import { Dialog } from '@/components/ui/Dialog';
import { tick_icon } from '@/assets';

interface PasswordCreatedModalProps {
  isOpen: boolean;
  /** Dismisses the dialog and returns to sign-in. */
  onPrimaryClick: () => void;
}

/** Confirms the password was updated and sends the user back to sign-in. */
export const PasswordCreatedModal: React.FC<PasswordCreatedModalProps> = ({
  isOpen,
  onPrimaryClick,
}) => (
  <Dialog
    isOpen={isOpen}
    title="Password Created!"
    subtitle="Your password has been successfully updated. You can now use your new password to log in."
    primaryButtonText="Okay"
    onPrimaryClick={onPrimaryClick}
    icon={
      <div className="flex h-20 w-20 items-center justify-center">
        <Image src={tick_icon} alt="" width={80} height={80} className="h-20 w-20" />
      </div>
    }
  />
);
