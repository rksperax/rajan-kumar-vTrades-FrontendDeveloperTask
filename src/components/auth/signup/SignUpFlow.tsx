'use client';

import React, { useState } from 'react';

import { Header } from '@/components/ui/Header';
import { SignUpForm } from '@/components/auth/signup/SignUpForm';
import { OtpVerificationForm } from '@/components/auth/signup/OtpVerificationForm';

/**
 * Drives the two-step sign-up: collect credentials, then verify the emailed
 * code. Kept as a client component so the page itself can export metadata.
 */
export const SignUpFlow = () => {
  const [pending, setPending] = useState<{ email: string; password: string } | null>(null);

  return (
    <>
      <Header
        title={pending ? 'Verify OTP' : 'Sign Up'}
        subtitle={
          pending
            ? `Enter the 6-digit code sent to ${pending.email}`
            : 'Manage your workspace seamlessly. Sign up to continue.'
        }
      />

      {pending ? (
        <OtpVerificationForm
          email={pending.email}
          password={pending.password}
          onBack={() => setPending(null)}
        />
      ) : (
        <SignUpForm onSuccess={(email, password) => setPending({ email, password })} />
      )}
    </>
  );
};
