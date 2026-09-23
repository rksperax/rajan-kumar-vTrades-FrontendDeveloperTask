import { NextResponse } from 'next/server';

import { findUser } from '@/lib/usersDb';

interface SignUpBody {
  email?: string;
  password?: string;
}

/**
 * Checks that an address is free. The account itself is written once the code
 * is verified, so an abandoned sign-up leaves nothing behind.
 */
export async function POST(request: Request) {
  let body: SignUpBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Malformed request body' }, { status: 400 });
  }

  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json(
      { message: 'Password must be at least 8 characters' },
      { status: 400 }
    );
  }

  if (await findUser(email)) {
    return NextResponse.json(
      { message: 'An account with this email already exists' },
      { status: 409 }
    );
  }

  return NextResponse.json(
    { message: 'Verify the code we sent to your email.', email },
    { status: 200 }
  );
}
