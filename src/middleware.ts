import { auth } from '@/auth';
import { NextResponse } from 'next/server';

/** Keeps signed-in users away from the auth screens. */
export default auth((request) => {
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');

  if (request.auth && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
