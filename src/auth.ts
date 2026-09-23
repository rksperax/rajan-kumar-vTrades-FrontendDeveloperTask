import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

/**
 * Auth.js configuration. The Google provider reads `AUTH_GOOGLE_ID` and
 * `AUTH_GOOGLE_SECRET` from the environment, and sessions are signed with
 * `AUTH_SECRET` — see `.env.example`.
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  pages: {
    // Send unauthenticated users to our own screen rather than the built-in one.
    signIn: '/auth/signin',
  },
});
