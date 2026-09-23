'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

/** Stages of the password reset journey, in the order they occur. */
export type ForgotPasswordStep =
  | 'EMAIL'
  | 'LINK_SENT'
  | 'OTP'
  | 'NEW_PASSWORD'
  | 'PASSWORD_CREATED';

/**
 * POSTs a JSON body and returns the parsed response, surfacing any failure as
 * a toast. Resolves to `null` when the caller should stay on the current step.
 */
async function postJson(url: string, body: unknown, fallbackMessage: string) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message ?? fallbackMessage);
      return null;
    }

    return data as { message: string };
  } catch {
    // Network-level failure: the request never reached the route handler.
    toast.error('Something went wrong. Please try again.');
    return null;
  }
}

/**
 * Drives the multi-step password reset. Each action awaits its request and
 * advances the step only on success, so callers can bind their own submitting
 * state to the returned promise.
 */
export const useForgotPassword = () => {
  const router = useRouter();
  const [step, setStep] = useState<ForgotPasswordStep>('EMAIL');
  const [email, setEmail] = useState('');

  const requestReset = useCallback(async (address: string) => {
    const data = await postJson(
      '/api/auth/forgot-password',
      { email: address },
      'Failed to send reset instructions'
    );
    if (!data) return;

    setEmail(address);
    setStep('LINK_SENT');
  }, []);

  const verifyOtp = useCallback(
    async (otp: string) => {
      const data = await postJson(
        '/api/auth/forgot-password/verify',
        { email, otp },
        'Failed to verify the code'
      );
      if (!data) return;

      setStep('NEW_PASSWORD');
    },
    [email]
  );

  const updatePassword = useCallback(
    async (newPassword: string) => {
      const data = await postJson(
        '/api/auth/password-create',
        { email, newPassword },
        'Failed to update your password'
      );
      if (!data) return;

      setStep('PASSWORD_CREATED');
    },
    [email]
  );

  const resendOtp = useCallback(async () => {
    const data = await postJson(
      '/api/auth/forgot-password',
      { email },
      'Failed to resend the code'
    );
    if (data) toast.success('A new code is on its way');
  }, [email]);

  /** Dismisses the "link sent" dialog and moves on to code entry. */
  const goToOtpStep = useCallback(() => setStep('OTP'), []);

  /** Returns to the first step so a different address can be used. */
  const changeEmail = useCallback(() => {
    setEmail('');
    setStep('EMAIL');
  }, []);

  /** Closes the success dialog and hands the user back to sign-in. */
  const finish = useCallback(() => router.push('/auth/signin'), [router]);

  return {
    step,
    email,
    requestReset,
    verifyOtp,
    updatePassword,
    resendOtp,
    goToOtpStep,
    changeEmail,
    finish,
  };
};
