import { NextResponse } from 'next/server';

import { findUser, hashPassword, normaliseEmail, readUsers, toPublicUser, writeUsers } from '@/lib/usersDb';

interface VerifyOtpBody {
  email?: string;
  password?: string;
  otp?: string;
}

/**
 * Completes sign-up. Any code is accepted — nothing is actually emailed — and
 * the account is written to the JSON database.
 */
export async function POST(request: Request) {
  let body: VerifyOtpBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Malformed request body' }, { status: 400 });
  }

  const { email, password, otp } = body;

  if (!email || !password || !otp) {
    return NextResponse.json(
      { message: 'Email, password and OTP are required' },
      { status: 400 }
    );
  }

  if (await findUser(email)) {
    return NextResponse.json(
      { message: 'An account with this email already exists' },
      { status: 409 }
    );
  }

  const address = normaliseEmail(email);
  const user = {
    email: address,
    // Fall back to the local part of the address as a display name.
    name: address.split('@')[0],
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  const users = await readUsers();
  await writeUsers([...users, user]);

  return NextResponse.json(
    { message: 'Account created. Please sign in.', user: toPublicUser(user) },
    { status: 201 }
  );
}
