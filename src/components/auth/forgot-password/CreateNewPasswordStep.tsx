'use client';

import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Header } from '@/components/ui/Header';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

/** The confirmation error is reported against the field the user must fix. */
const newPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please re-enter your new password'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Oops! Passwords don't match",
    path: ['confirmPassword'],
  });

type NewPasswordFormValues = z.infer<typeof newPasswordSchema>;

interface CreateNewPasswordStepProps {
  /** Saves the chosen password; the step advances on success. */
  onSubmit: (password: string) => Promise<void>;
}

/** Final reset step: choose and confirm the new password. */
export const CreateNewPasswordStep: React.FC<CreateNewPasswordStepProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const [password, confirmPassword] = useWatch({ control, name: ['password', 'confirmPassword'] });

  return (
    <>
      <Header
        title="Create New Password"
        subtitle="Choose a strong and secure password to keep your account safe. Make sure it's easy for you to remember, but hard for others to guess!"
      />

      <form
        className="flex flex-col gap-6"
        onSubmit={handleSubmit((values) => onSubmit(values.password))}
        noValidate
      >
        <Input
          label="Password"
          type="password"
          placeholder="***************"
          autoComplete="new-password"
          disabled={isSubmitting}
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="Re-enter your new password"
          type="password"
          placeholder="***************"
          autoComplete="new-password"
          disabled={isSubmitting}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button
          type="submit"
          className="w-full"
          loading={isSubmitting}
          disabled={!password || !confirmPassword}
        >
          Update Password
        </Button>
      </form>
    </>
  );
};
