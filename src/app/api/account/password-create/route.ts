import { NextResponse } from 'next/server';

import { hashPassword, normaliseEmail, readUsers, writeUsers } from '@/lib/usersDb';

interface PasswordCreateBody {
  email?: string;
  newPassword?: string;
}

/** Replaces the password on an existing account in the JSON database. */
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

  const address = normaliseEmail(email);
  const users = await readUsers();
  const index = users.findIndex((user) => user.email === address);

  if (index === -1) {
    return NextResponse.json({ message: 'No account found with this email' }, { status: 404 });
  }

  const updated = { ...users[index], passwordHash: hashPassword(newPassword) };
  await writeUsers(users.map((user, i) => (i === index ? updated : user)));

  return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
}
