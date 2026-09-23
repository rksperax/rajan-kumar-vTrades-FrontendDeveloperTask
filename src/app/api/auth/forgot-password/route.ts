import { NextResponse } from 'next/server';

import { findUser } from '@/lib/usersDb';

interface ForgotPasswordBody {
  email?: string;
}

/**
 * Starts a password reset. The demo says plainly when there is no account, so
 * a tester is not left guessing why their new password never works; a real app
 * would stay vague to avoid revealing which addresses are registered.
 */
export async function POST(request: Request) {
  let body: ForgotPasswordBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Malformed request body' }, { status: 400 });
  }

  if (!body.email) {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 });
  }

  if (!(await findUser(body.email))) {
    return NextResponse.json({ message: 'No account found with this email' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Reset instructions sent to your email' }, { status: 200 });
}
