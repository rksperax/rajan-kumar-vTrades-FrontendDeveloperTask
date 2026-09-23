import React from 'react';

/** Props for {@link Header}. */
interface HeaderProps {
  /** Main heading text. */
  title: string;
  /** Supporting copy rendered under the title. */
  subtitle?: string;
  className?: string;
}

/** Page heading used at the top of each auth screen. */
export const Header: React.FC<HeaderProps> = ({ title, subtitle, className = '' }) => (
  <div className={`flex flex-col gap-2 text-foreground ${className}`}>
    <h1 className="text-32 font-bold">{title}</h1>
    {subtitle && <p className="text-sm">{subtitle}</p>}
  </div>
);
