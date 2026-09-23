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
  const [email, setEmail] = useState('');
  const isVerifying = email !== '';

  return (
    <>
      <Header
        title={isVerifying ? 'Verify OTP' : 'Sign Up'}
        subtitle={
          isVerifying
            ? `Enter the 6-digit code sent to ${email}`
            : 'Manage your workspace seamlessly. Sign up to continue.'
        }
      />

      {isVerifying ? (
        <OtpVerificationForm email={email} onBack={() => setEmail('')} />
      ) : (
        <SignUpForm onSuccess={setEmail} />
      )}
    </>
  );
};
