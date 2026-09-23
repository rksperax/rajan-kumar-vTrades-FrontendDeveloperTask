'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { OtpInput } from '@/components/ui/OtpInput';
import { Button } from '@/components/ui/Button';
import { verifyOtpRequest } from '@/lib/authApi';

const otpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, 'Enter the 6-digit code'),
});

type OtpFormValues = z.infer<typeof otpSchema>;

interface OtpVerificationFormProps {
  /** Address the code was sent to. */
  email: string;
  /** Password chosen on the previous step; stored once the code is accepted. */
  password: string;
  /** Returns to the credentials step. */
  onBack: () => void;
}

/**
 * Second sign-up step. Any six-digit code is accepted — there is no real email
 * — and the account is created once it is entered.
 */
export const OtpVerificationForm: React.FC<OtpVerificationFormProps> = ({
  email,
  password,
  onBack,
}) => {
  const router = useRouter();

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

  const onSubmit = async (values: OtpFormValues) => {
    const result = await verifyOtpRequest(email, password, values.otp);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    router.push('/auth/signin');
  };

  return (
    <>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-col gap-3">
          <OtpInput
            onChange={(value) => setValue('otp', value, { shouldValidate: Boolean(errors.otp) })}
            disabled={isSubmitting}
            invalid={Boolean(errors.otp)}
            describedBy={errors.otp ? 'otp-error' : undefined}
          />
          {errors.otp && (
            <p id="otp-error" role="alert" className="text-xs text-destructive">
              {errors.otp.message}
            </p>
          )}
        </div>

        <Button type="submit" className="mt-2 w-full" loading={isSubmitting} disabled={otp.length !== 6}>
          Verify OTP
        </Button>
      </form>

      <p className="mt-4 text-center text-xs text-foreground">
        <button type="button" onClick={onBack} className="font-medium text-primary hover:underline">
          Back to Sign Up
        </button>
      </p>
    </>
  );
};
