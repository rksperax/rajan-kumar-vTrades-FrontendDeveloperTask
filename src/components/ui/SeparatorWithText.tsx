import React from 'react';

/** Horizontal rule with a centred label, used to split the form from the SSO buttons. */
export const SeparatorWithText: React.FC<{ text?: string }> = ({ text = 'or' }) => (
  <div className="relative">
    <div className="absolute inset-0 flex items-center" aria-hidden="true">
      <span className="w-full border-t border-secondary" />
    </div>
    <div className="relative flex justify-center text-xs">
      <span className="bg-background px-2 text-foreground">{text}</span>
    </div>
  </div>
);
