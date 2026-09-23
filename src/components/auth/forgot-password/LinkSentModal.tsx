import React from 'react';
import Image from 'next/image';
import { Dialog } from '@/components/ui/Dialog';
import { mail_icon } from '@/assets';

interface LinkSentModalProps {
  isOpen: boolean;
  /** Dismisses the dialog and moves on to code entry. */
  onPrimaryClick: () => void;
}

/** Confirms that reset instructions were sent. */
export const LinkSentModal: React.FC<LinkSentModalProps> = ({ isOpen, onPrimaryClick }) => (
  <Dialog
    isOpen={isOpen}
    title="Link Sent Successfully!"
    subtitle="Check your inbox! We've sent you an email with instructions to reset your password."
    primaryButtonText="Okay"
    onPrimaryClick={onPrimaryClick}
    icon={
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success">
        <Image src={mail_icon} alt="" width={40} height={40} className="h-10 w-10" />
      </div>
    }
  />
);
