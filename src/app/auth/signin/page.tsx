import type { Metadata } from 'next';
import { Header } from '@/components/ui/Header';
import { AuthContainer } from '@/components/auth/AuthContainer';
import { SignInForm } from '@/components/auth/signin/SignInForm';

export const metadata: Metadata = {
  title: 'Sign In | vTrades',
};

export default function SignInPage() {
  return (
    <AuthContainer>
      <Header title="Sign In" subtitle="Manage your workspace seamlessly. Sign in to continue." />
      <SignInForm />
    </AuthContainer>
  );
}
