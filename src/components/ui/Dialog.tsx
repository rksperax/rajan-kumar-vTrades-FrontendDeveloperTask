'use client';

import React, { useEffect } from 'react';
import { Button } from './Button';

/** Props for {@link Dialog}. */
interface DialogProps {
  isOpen: boolean;
  /** Artwork shown above the title. */
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  primaryButtonText: string;
  onPrimaryClick?: () => void;
  loading?: boolean;
  /**
   * Dismisses the dialog via Escape or a backdrop click. Omit it for a dialog
   * whose only way forward is the primary action.
   */
  onClose?: () => void;
}

/** Centred modal with an icon, a message and a single primary action. */
export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  icon,
  title,
  subtitle,
  primaryButtonText,
  onPrimaryClick,
  loading = false,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen || !onClose) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Stop the page behind the dialog from scrolling while it is open.
  useEffect(() => {
    if (!isOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-subtitle"
        className="relative flex w-full max-w-md flex-col items-center rounded-lg bg-secondary p-6 text-center shadow-lg"
      >
        <div className="mb-4">{icon}</div>

        <h2 id="dialog-title" className="mb-2 text-xl font-semibold text-secondary-foreground">
          {title}
        </h2>
        <p id="dialog-subtitle" className="mb-6 text-sm text-muted-foreground">
          {subtitle}
        </p>

        <Button className="w-full text-base" onClick={onPrimaryClick} loading={loading} autoFocus>
          {primaryButtonText}
        </Button>
      </div>
    </div>
  );
};
