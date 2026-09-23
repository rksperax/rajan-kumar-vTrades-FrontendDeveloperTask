import { NextResponse } from 'next/server';

/** Shape of the JSON body this route expects. */
interface SignUpBody {
  email?: string;
  password?: string;
}

/** Addresses the mock backend treats as already registered. */
const TAKEN_EMAILS = ['taken@workhive.com'];

/**
 * Mock sign-up endpoint. Accepts any well-formed credentials except for an
 * address that is already registered, and reports that an OTP was sent.
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

  // Stand in for the latency of a real auth call so loading states are visible.
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (TAKEN_EMAILS.includes(email.toLowerCase())) {
    return NextResponse.json({ message: 'An account with this email already exists' }, { status: 409 });
  }

  return NextResponse.json(
    { message: 'Account created. Please verify the OTP sent to your email.', email },
    { status: 201 }
  );
}
