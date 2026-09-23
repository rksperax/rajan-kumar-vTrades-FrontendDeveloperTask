'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import {
  createPasswordRequest,
  forgotPasswordRequest,
  verifyResetOtpRequest,
} from '@/lib/authApi';

/** Stages of the password reset journey, in the order they occur. */
export type ForgotPasswordStep =
  | 'EMAIL'
  | 'LINK_SENT'
  | 'OTP'
  | 'NEW_PASSWORD'
  | 'PASSWORD_CREATED';

/**
 * Drives the multi-step password reset through the auth API. Each action
 * advances the step only on success, so callers can bind their own submitting
 * state to the returned promise.
 */
export const useForgotPassword = () => {
  const router = useRouter();
  const [step, setStep] = useState<ForgotPasswordStep>('EMAIL');
  const [email, setEmail] = useState('');

  const requestReset = useCallback(async (address: string) => {
    const result = await forgotPasswordRequest(address);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    setEmail(address);
    setStep('LINK_SENT');
  }, []);

  const verifyOtp = useCallback(
    async (otp: string) => {
      const result = await verifyResetOtpRequest(email, otp);

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      setStep('NEW_PASSWORD');
    },
    [email]
  );

  const updatePassword = useCallback(
    async (newPassword: string) => {
      const result = await createPasswordRequest(email, newPassword);

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      setStep('PASSWORD_CREATED');
    },
    [email]
  );

  const resendOtp = useCallback(async () => {
    const result = await forgotPasswordRequest(email);
    if (result.ok) toast.success('A new code is on its way');
    else toast.error(result.message);
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
