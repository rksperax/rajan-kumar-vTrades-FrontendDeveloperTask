import type { Metadata } from 'next';
import { ForgotPasswordFlow } from '@/components/auth/forgot-password/ForgotPasswordFlow';

export const metadata: Metadata = {
  title: 'Forgot Password | vTrades',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordFlow />;
}
