import { NextResponse } from 'next/server';

import { auth } from '@/auth';
import { SESSION_COOKIE } from '@/lib/sessionCookie';

/**
 * Keeps signed-in users away from the auth screens, whether the session came
 * from Google or from the JSON database's session cookie.
 */
export default auth((request) => {
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const hasLocalSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  if (isAuthPage && (request.auth || hasLocalSession)) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
