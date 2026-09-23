import 'server-only';

import { cookies } from 'next/headers';
import type { PublicUser } from '@/lib/usersDb';
import { SESSION_COOKIE } from '@/lib/sessionCookie';

/**
 * Session cookie for accounts held in the JSON database. It carries the user
 * as plain JSON — enough for a demo, whereas a real app would store a signed
 * token or an opaque id pointing at server-side session state.
 */

const MAX_AGE_SECONDS = 60 * 60 * 24; // one day

/** Starts a session for this browser. */
export async function startSession(user: PublicUser) {
  const store = await cookies();

  store.set(SESSION_COOKIE, JSON.stringify(user), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: MAX_AGE_SECONDS,
  });
}

/** Returns the signed-in user, or null when the cookie is absent or unreadable. */
export async function readSession(): Promise<PublicUser | null> {
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!value) return null;

  try {
    return JSON.parse(value) as PublicUser;
  } catch {
    return null;
  }
}

/** Ends the session. */
export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}
