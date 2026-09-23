'use client';

import React from 'react';

import { useForgotPassword } from '@/hooks/useForgotPassword';
import { EmailStep } from '@/components/auth/forgot-password/EmailStep';
import { EnterOtpStep } from '@/components/auth/forgot-password/EnterOtpStep';
import { CreateNewPasswordStep } from '@/components/auth/forgot-password/CreateNewPasswordStep';
import { LinkSentModal } from '@/components/auth/forgot-password/LinkSentModal';
import { PasswordCreatedModal } from '@/components/auth/forgot-password/PasswordCreatedModal';

/**
 * Renders the reset journey one step at a time. The two confirmation dialogs
 * sit above the step they interrupt, so the form behind them stays in place.
 */
export const ForgotPasswordFlow = () => {
  const {
    step,
    email,
    requestReset,
    verifyOtp,
    updatePassword,
    resendOtp,
    goToOtpStep,
    changeEmail,
    finish,
  } = useForgotPassword();

  return (
    <>
      {(step === 'EMAIL' || step === 'LINK_SENT') && <EmailStep onSubmit={requestReset} />}

      {step === 'OTP' && (
        <EnterOtpStep
          email={email}
          onSubmit={verifyOtp}
          onResend={resendOtp}
          onChangeEmail={changeEmail}
        />
      )}

      {(step === 'NEW_PASSWORD' || step === 'PASSWORD_CREATED') && (
        <CreateNewPasswordStep onSubmit={updatePassword} />
      )}

      <LinkSentModal isOpen={step === 'LINK_SENT'} onPrimaryClick={goToOtpStep} />
      <PasswordCreatedModal isOpen={step === 'PASSWORD_CREATED'} onPrimaryClick={finish} />
    </>
  );
};
