import 'server-only';

import { cookies } from 'next/headers';
import type { PublicUser } from '@/lib/usersDb';
import { SESSION_COOKIE } from '@/lib/sessionCookie';

/**
 * Session cookie for accounts held in the JSON database. It carries the user
 * as plain JSON — enough for a demo, whereas a real app would store a signed
 * token or an opaque id pointing at server-side session state.
 */

/** How long a remembered session survives. */
const REMEMBERED_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // thirty days

/**
 * Starts a session for this browser.
 *
 * @param remember When true the cookie is given an expiry and survives a
 * browser restart. When false it is written without one, making it a session
 * cookie that the browser drops when it closes.
 */
export async function startSession(user: PublicUser, remember = false) {
  const store = await cookies();

  store.set(SESSION_COOKIE, JSON.stringify(user), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    ...(remember ? { maxAge: REMEMBERED_MAX_AGE_SECONDS } : {}),
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
