import React from 'react';

/** Constrains an auth form to the design's column width and spaces its sections. */
export const AuthContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`mx-auto flex w-full max-w-[385px] flex-col gap-6 ${className}`}>{children}</div>
);
