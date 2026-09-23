'use client';

import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Header } from '@/components/ui/Header';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const emailSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .pipe(z.email('Please enter a valid email address')),
});

type EmailFormValues = z.infer<typeof emailSchema>;

interface EmailStepProps {
  /** Sends the reset request; the step advances on success. */
  onSubmit: (email: string) => Promise<void>;
}

/** First reset step: collect the address the instructions should go to. */
export const EmailStep: React.FC<EmailStepProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const email = useWatch({ control, name: 'email' });

  return (
    <>
      <Header
        title="Forgot Your Password?"
        subtitle="Don't worry! Enter your email address, and we'll send you a link to reset it."
      />

      <form
        className="flex flex-col gap-6"
        onSubmit={handleSubmit((values) => onSubmit(values.email))}
        noValidate
      >
        <Input
          label="Email Address"
          type="email"
          placeholder="navinash@workhive.com"
          autoComplete="email"
          disabled={isSubmitting}
          error={errors.email?.message}
          {...register('email')}
        />

        <Button type="submit" className="mt-2 w-full" loading={isSubmitting} disabled={!email}>
          Continue
        </Button>
      </form>
    </>
  );
};
