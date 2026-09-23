import { NextResponse } from 'next/server';

/** Shape of the JSON body this route expects. */
interface SignInBody {
  email?: string;
  password?: string;
}

/**
 * Mock sign-in endpoint. Any password is accepted for an `@workhive.com`
 * address; every other address is rejected as an invalid credential.
 */
export async function POST(request: Request) {
  let body: SignInBody;

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

  if (!email.endsWith('@workhive.com')) {
    return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
  }

  return NextResponse.json(
    { message: 'Signed in successfully', user: { email, name: 'Demo User' } },
    { status: 200 }
  );
}
