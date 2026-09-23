import { NextResponse } from 'next/server';

/** Shape of the JSON body this route expects. */
interface PasswordCreateBody {
  email?: string;
  newPassword?: string;
}

/** Mock endpoint that stores the new password chosen during a reset. */
export async function POST(request: Request) {
  let body: PasswordCreateBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Malformed request body' }, { status: 400 });
  }

  const { email, newPassword } = body;

  if (!email || !newPassword) {
    return NextResponse.json({ message: 'Email and new password are required' }, { status: 400 });
  }

  if (newPassword.length < 8) {
    return NextResponse.json(
      { message: 'Password must be at least 8 characters' },
      { status: 400 }
    );
  }

  // Stand in for the latency of a real auth call so loading states are visible.
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
}
