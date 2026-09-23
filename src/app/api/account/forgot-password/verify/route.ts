import { NextResponse } from 'next/server';

import { findUser } from '@/lib/usersDb';

interface VerifyResetOtpBody {
  email?: string;
  otp?: string;
}

/** Checks the reset code. Any code is accepted; nothing is actually emailed. */
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

  if (!(await findUser(email))) {
    return NextResponse.json({ message: 'No account found with this email' }, { status: 404 });
  }

  return NextResponse.json({ message: 'OTP verified successfully' }, { status: 200 });
}
