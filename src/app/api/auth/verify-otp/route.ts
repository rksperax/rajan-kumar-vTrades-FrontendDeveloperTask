import { NextResponse } from 'next/server';

/** Shape of the JSON body this route expects. */
interface VerifyOtpBody {
  email?: string;
  otp?: string;
}

/**
 * Mock OTP verification endpoint for the sign-up flow. With no real code to
 * check against, any code the user submits is accepted; only a missing email
 * or code is rejected.
 */
export async function POST(request: Request) {
  let body: VerifyOtpBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Malformed request body' }, { status: 400 });
  }

  const { email, otp } = body;

  if (!email || !otp) {
    return NextResponse.json({ message: 'Email and OTP are required' }, { status: 400 });
  }

  // Stand in for the latency of a real auth call so loading states are visible.
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return NextResponse.json({ message: 'Email verified successfully' }, { status: 200 });
}
