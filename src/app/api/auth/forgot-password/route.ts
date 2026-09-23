import { NextResponse } from 'next/server';

/** Shape of the JSON body this route expects. */
interface ForgotPasswordBody {
  email?: string;
}

/**
 * Mock "send reset link" endpoint. Always reports success for a supplied
 * address, mirroring the common practice of not revealing whether an account
 * exists.
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

  // Stand in for the latency of a real auth call so loading states are visible.
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return NextResponse.json({ message: 'Reset instructions sent to your email' }, { status: 200 });
}
