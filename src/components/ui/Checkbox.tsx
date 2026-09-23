import React from 'react';

/** Props for {@link Checkbox}, extending the native input attributes. */
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label rendered beside the box. */
  label?: string;
}

/** Checkbox tinted with the brand colour, wrapped in a clickable label. */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', label, ...props }, ref) => (
    <label className={`flex cursor-pointer items-center gap-2 ${className}`}>
      <input
        type="checkbox"
        ref={ref}
        className="peer h-5 w-5 shrink-0 cursor-pointer rounded border border-secondary bg-secondary accent-primary disabled:cursor-not-allowed disabled:opacity-50"
        {...props}
      />
      {label && (
        <span className="text-xs font-medium leading-none text-foreground peer-disabled:opacity-70">
          {label}
        </span>
      )}
    </label>
  )
);

Checkbox.displayName = 'Checkbox';
