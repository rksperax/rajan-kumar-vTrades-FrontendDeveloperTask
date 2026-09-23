import { NextResponse } from 'next/server';

import { findUser, hashPassword, toPublicUser } from '@/lib/usersDb';
import { startSession } from '@/lib/session';

interface SignInBody {
  email?: string;
  password?: string;
  /** Keeps the session across browser restarts when true. */
  rememberMe?: boolean;
}

/** Verifies credentials against the JSON database and opens a session. */
export async function POST(request: Request) {
  let body: SignInBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Malformed request body' }, { status: 400 });
  }

  const { email, password, rememberMe } = body;

  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
  }

  const user = await findUser(email);

  // One message for both cases, so the response does not reveal which
  // addresses have accounts.
  if (!user || user.passwordHash !== hashPassword(password)) {
    return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
  }

  await startSession(toPublicUser(user), rememberMe === true);

  return NextResponse.json(
    { message: 'Signed in successfully', user: toPublicUser(user) },
    { status: 200 }
  );
}
