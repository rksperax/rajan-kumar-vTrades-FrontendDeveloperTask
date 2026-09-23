'use client';

import React, { useRef, useState } from 'react';

/** Props for {@link OtpInput}. */
interface OtpInputProps {
  /** Number of digits to collect. @default 6 */
  length?: number;
  /** Called with the joined code whenever a digit changes. */
  onChange: (otp: string) => void;
  disabled?: boolean;
  /** Marks every box as invalid and wires them to an external error message. */
  invalid?: boolean;
  /** Id of the element describing the error, for screen readers. */
  describedBy?: string;
}

/**
 * Row of single-character boxes for entering a one-time code. Advances on
 * input, steps back on backspace, and accepts a pasted code into all boxes.
 */
export const OtpInput: React.FC<OtpInputProps> = ({
  length = 6,
  onChange,
  disabled,
  invalid,
  describedBy,
}) => {
  const [digits, setDigits] = useState<string[]>(() => new Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const commit = (next: string[]) => {
    setDigits(next);
    onChange(next.join(''));
  };

  const handleChange = (index: number, value: string) => {
    // Keep only the last character typed, and only if it is a digit.
    const digit = value.slice(-1);
    if (digit && !/^\d$/.test(digit)) return;

    const next = [...digits];
    next[index] = digit;
    commit(next);

    if (digit && index < length - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (event.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus();
    if (event.key === 'ArrowRight' && index < length - 1) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;

    event.preventDefault();
    const next = new Array(length).fill('').map((_, i) => pasted[i] ?? '');
    commit(next);
    inputRefs.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div className="flex justify-between gap-3">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          value={digit}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          disabled={disabled}
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          aria-label={`Digit ${index + 1} of ${length}`}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className={`h-12 w-12 rounded-md border bg-muted text-center text-xl text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
            invalid ? 'border-destructive' : 'border-secondary'
          }`}
          placeholder="0"
        />
      ))}
    </div>
  );
};
