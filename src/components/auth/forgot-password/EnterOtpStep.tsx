'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Header } from '@/components/ui/Header';
import { Button } from '@/components/ui/Button';
import { OtpInput } from '@/components/ui/OtpInput';
import { timer_icon } from '@/assets';

const otpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, 'Enter the 6-digit code'),
});

type OtpFormValues = z.infer<typeof otpSchema>;

interface EnterOtpStepProps {
  /** Address the code was sent to, shown in the subtitle. */
  email: string;
  /** Submits the entered code; the step advances on success. */
  onSubmit: (otp: string) => Promise<void>;
  /** Requests a fresh code and restarts the countdown. */
  onResend: () => Promise<void>;
  /** Returns to the email step. */
  onChangeEmail: () => void;
  /** Seconds to wait before resending is offered. @default 30 */
  resendSeconds?: number;
}

/** Second reset step: enter the emailed code. */
export const EnterOtpStep: React.FC<EnterOtpStepProps> = ({
  email,
  onSubmit,
  onResend,
  onChangeEmail,
  resendSeconds = 30,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(resendSeconds);

  // Ticks down one second at a time and stops scheduling once it hits zero.
  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timeout = setTimeout(() => setSecondsLeft((current) => current - 1), 1000);
    return () => clearTimeout(timeout);
  }, [secondsLeft]);

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  const otp = useWatch({ control, name: 'otp' });

  const handleResend = async () => {
    await onResend();
    setSecondsLeft(resendSeconds);
  };

  return (
    <>
      <Header title="Enter OTP" subtitle={`Enter the OTP that we have sent to ${email}.`} />

      <form className="flex flex-col gap-6" onSubmit={handleSubmit((values) => onSubmit(values.otp))} noValidate>
        <div>
          <Button variant="link" type="button" onClick={onChangeEmail}>
            Change Email Address
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          <OtpInput
            onChange={(value) => setValue('otp', value, { shouldValidate: Boolean(errors.otp) })}
            disabled={isSubmitting}
            invalid={Boolean(errors.otp)}
            describedBy={errors.otp ? 'reset-otp-error' : undefined}
          />
          {errors.otp && (
            <p id="reset-otp-error" role="alert" className="text-xs text-destructive">
              {errors.otp.message}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {secondsLeft > 0 ? (
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Image src={timer_icon} alt="" width={18} height={18} />
              <p className="leading-4">{secondsLeft} Sec</p>
            </div>
          ) : (
            <Button variant="link" type="button" onClick={handleResend}>
              Resend OTP
            </Button>
          )}
        </div>

        <Button type="submit" className="w-full" loading={isSubmitting} disabled={otp.length !== 6}>
          Continue
        </Button>
      </form>
    </>
  );
};
