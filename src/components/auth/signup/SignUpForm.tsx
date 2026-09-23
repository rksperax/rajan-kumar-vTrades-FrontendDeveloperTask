'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SeparatorWithText } from '@/components/ui/SeparatorWithText';
import { google_logo, microsoft_logo } from '@/assets';
import { signUpRequest } from '@/lib/authApi';

/**
 * Validation rules for the sign-up form. The confirmation check reports against
 * `confirmPassword` so the message renders under the field the user must fix.
 */
const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email is required')
      .pipe(z.email('Please enter a valid email address')),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

interface SignUpFormProps {
  /**
   * Called once the address is free. The account itself is created after the
   * code is verified, so an abandoned sign-up leaves nothing behind.
   */
  onSuccess: (email: string, password: string) => void;
}

/** Account creation form. Posts to the mock `/api/auth/signup` endpoint. */
export const SignUpForm: React.FC<SignUpFormProps> = ({ onSuccess }) => {
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  // Keeps the submit button disabled until every field has something in it.
  const [email, password, confirmPassword] = useWatch({
    control,
    name: ['email', 'password', 'confirmPassword'],
  });

  const onSubmit = async (values: SignUpFormValues) => {
    const result = await signUpRequest(values.email, values.password);

    if (!result.ok) {
      // A taken address belongs under the email field; anything else is a toast.
      if (result.status === 409) setError('email', { message: result.message });
      else toast.error(result.message);
      return;
    }

    toast.success(result.message);
    onSuccess(values.email, values.password);
  };

  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      // Redirects to Google; on return, Auth.js lands the user on `/`.
      await signIn('google', { redirectTo: '/' });
    } catch {
      toast.error('Could not reach Google. Please try again.');
      setIsGoogleLoading(false);
    }
  };

  // Microsoft is not configured as a provider yet.
  const handleSsoUnavailable = (provider: string) => {
    toast.info(`${provider} sign-up is not connected yet`);
  };

  return (
    <>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Email Address"
          type="email"
          placeholder="navinash@workhive.com"
          autoComplete="email"
          disabled={isSubmitting}
          error={errors.email?.message}
          {...register('email')}
        />

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
          label="Confirm Password"
          type="password"
          placeholder="***************"
          autoComplete="new-password"
          disabled={isSubmitting}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button
          type="submit"
          className="mt-2 w-full"
          loading={isSubmitting}
          disabled={!email || !password || !confirmPassword}
        >
          Sign Up
        </Button>
      </form>

      <SeparatorWithText />

      <div className="flex flex-col gap-3">
        <Button
          variant="secondary"
          className="w-full"
          onClick={handleGoogleSignIn}
          loading={isGoogleLoading}
          icon={<Image src={google_logo} alt="" width={20} height={20} />}
        >
          Sign Up with Google
        </Button>

        <Button
          variant="secondary"
          className="w-full"
          onClick={() => handleSsoUnavailable('Microsoft')}
          icon={<Image src={microsoft_logo} alt="" width={20} height={20} />}
        >
          Sign Up with Microsoft
        </Button>
      </div>

      <p className="mt-4 text-center text-xs text-foreground">
        Already have an account?{' '}
        <Link href="/auth/signin" className="font-medium text-primary hover:underline">
          Sign In
        </Link>
      </p>
    </>
  );
};
