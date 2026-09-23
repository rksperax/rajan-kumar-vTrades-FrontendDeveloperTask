'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { showing_password_icon, hidden_password_icon, error_info_icon } from '@/assets';

/** Props for {@link Input}, extending the native input attributes. */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label rendered above the field. */
  label?: string;
  /** Validation message; when set, the field is styled as invalid. */
  error?: string;
}

/**
 * Labelled text field. Inputs of type `password` gain a show/hide toggle, and
 * an `error` message renders below the field with an icon.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', type = 'text', label, error, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    const isPassword = type === 'password';
    // Swap the type rather than the element so the value survives the toggle.
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
      <div className="flex w-full flex-col gap-3">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium leading-none text-foreground">
            {label}
          </label>
        )}

        <div className="relative">
          <input
            id={inputId}
            type={inputType}
            ref={ref}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className={`flex h-[50px] w-full rounded-md border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 ${
              error ? 'border-destructive' : 'border-secondary'
            } ${isPassword ? 'pr-11' : ''} ${className}`}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <Image
                src={showPassword ? showing_password_icon : hidden_password_icon}
                alt=""
                width={20}
                height={20}
                className="h-5 w-5"
              />
            </button>
          )}
        </div>

        {error && (
          <div id={errorId} role="alert" className="flex items-center gap-1">
            <Image src={error_info_icon} alt="" width={18} height={18} className="h-[18px] w-[18px]" />
            <p className="text-xs text-destructive">{error}</p>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
