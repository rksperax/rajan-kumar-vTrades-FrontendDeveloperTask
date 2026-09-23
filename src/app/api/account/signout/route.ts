import { NextResponse } from 'next/server';

import { endSession } from '@/lib/session';

/** Clears the session cookie. */
export async function POST() {
  await endSession();
  return NextResponse.json({ message: 'Signed out' }, { status: 200 });
}
