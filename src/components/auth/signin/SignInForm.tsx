'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { SeparatorWithText } from '@/components/ui/SeparatorWithText';
import { google_logo, microsoft_logo } from '@/assets';
import { signInRequest } from '@/lib/authApi';
import { DEMO_CREDENTIALS } from '@/lib/demoCredentials';

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
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    // Pre-filled with the seeded account so the demo signs in with one click.
    defaultValues: {
      email: DEMO_CREDENTIALS.email,
      password: DEMO_CREDENTIALS.password,
      rememberMe: false,
    },
  });

  // Keeps the submit button disabled until both fields have something in them.
  const [email, password] = useWatch({ control, name: ['email', 'password'] });

  const onSubmit = async (values: SignInFormValues) => {
    const result = await signInRequest(values.email, values.password, values.rememberMe);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);
    // The route set the session cookie, so refresh the server-rendered page.
    router.replace('/');
    router.refresh();
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
          onClick={handleGoogleSignIn}
          loading={isGoogleLoading}
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
