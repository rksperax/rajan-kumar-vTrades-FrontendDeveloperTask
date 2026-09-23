import { NextResponse } from 'next/server';

/** Shape of the JSON body this route expects. */
interface VerifyResetOtpBody {
  email?: string;
  otp?: string;
}

/**
 * Mock OTP check for the password reset flow. With no real code to compare
 * against, any code is accepted; only a missing email or code is rejected.
 */
export async function POST(request: Request) {
  let body: VerifyResetOtpBody;

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

  return NextResponse.json({ message: 'OTP verified successfully' }, { status: 200 });
}
