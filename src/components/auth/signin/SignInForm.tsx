'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { SeparatorWithText } from '@/components/ui/SeparatorWithText';
import { google_logo, microsoft_logo } from '@/assets';

/**
 * Validation rules for the sign-in form. `min(1)` runs before the email format
 * check so an empty field reports "required" rather than "invalid".
 */
const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .pipe(z.email('Please enter a valid email address')),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean(),
});

/** Fields captured by the sign-in form. */
type SignInFormValues = z.infer<typeof signInSchema>;

/**
 * Credentials form for the sign-in screen. Validation and submission state are
 * handled by react-hook-form; the request goes to the mock `/api/auth/signin`
 * endpoint and failures surface as toasts.
 */
export const SignInForm = () => {
  const {
    register,
    handleSubmit,
    control,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  // Keeps the submit button disabled until both fields have something in them.
  const [email, password] = useWatch({ control, name: ['email', 'password'] });

  const onSubmit = async (values: SignInFormValues) => {
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email, password: values.password }),
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message ?? 'Failed to sign in');
        return;
      }

      // No authenticated area exists yet, so success only confirms the call.
      toast.success(data.message);
      resetField('password');
    } catch {
      // Network-level failure: the request never reached the route handler.
      toast.error('Something went wrong. Please try again.');
    }
  };

  // Placeholder until an OAuth provider is wired up for these buttons.
  const handleSsoUnavailable = (provider: string) => {
    toast.info(`${provider} sign-in is not connected yet`);
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
          autoComplete="current-password"
          disabled={isSubmitting}
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex items-center justify-between">
          <Checkbox label="Remember me" disabled={isSubmitting} {...register('rememberMe')} />
          <Link href="/auth/forgotpassword" className="text-xs font-medium text-primary hover:underline">
            Forgot Password?
          </Link>
        </div>

        <Button type="submit" className="mt-2 w-full" loading={isSubmitting} disabled={!email || !password}>
          Sign In
        </Button>
      </form>

      <SeparatorWithText />

      <div className="flex flex-col gap-3">
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => handleSsoUnavailable('Google')}
          icon={<Image src={google_logo} alt="" width={20} height={20} />}
        >
          Sign In with Google
        </Button>

        <Button
          variant="secondary"
          className="w-full"
          onClick={() => handleSsoUnavailable('Microsoft')}
          icon={<Image src={microsoft_logo} alt="" width={20} height={20} />}
        >
          Sign In with Microsoft
        </Button>
      </div>

      <p className="mt-4 text-center text-xs text-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/auth/signup" className="font-medium text-primary hover:underline">
          Sign Up
        </Link>
      </p>
    </>
  );
};
