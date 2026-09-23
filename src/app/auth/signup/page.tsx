import type { Metadata } from 'next';
import { SignUpFlow } from '@/components/auth/signup/SignUpFlow';

export const metadata: Metadata = {
  title: 'Sign Up | vTrades',
};

export default function SignUpPage() {
  return <SignUpFlow />;
}
