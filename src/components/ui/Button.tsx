import React from 'react';
import { Loader2 } from 'lucide-react';

/** Props for {@link Button}, extending the native button attributes. */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style of the button. @default 'primary' */
  variant?: 'primary' | 'secondary' | 'link';
  /** Icon rendered before the label; replaced by a spinner while loading. */
  icon?: React.ReactNode;
  /** Shows a spinner and disables interaction. @default false */
  loading?: boolean;
}

const VARIANTS: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-primary text-primary-foreground shadow hover:opacity-90',
  secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:opacity-90',
  link: 'text-primary underline-offset-4 hover:underline',
};

/** Button with primary/secondary/link styling, an optional icon and a loading state. */
export const Button: React.FC<ButtonProps> = ({
  className = '',
  variant = 'primary',
  icon,
  loading = false,
  children,
  disabled,
  ...props
}) => {
  const sizing = variant === 'link' ? 'h-auto p-0' : 'h-[50px] px-4 py-2';

  return (
    <button
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 ${VARIANTS[variant]} ${sizing} ${className}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      {children}
    </button>
  );
};
