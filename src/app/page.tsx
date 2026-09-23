import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { readSession } from '@/lib/session';
import { SignOutButton } from '@/components/home/SignOutButton';

/**
 * Landing page for a signed-in user. A session can come from Google via
 * Auth.js or from the JSON database via the session cookie, so both are
 * checked before anyone is sent back to sign-in.
 */
export default async function Home() {
  const googleSession = await auth();
  const localSession = await readSession();

  const user = googleSession?.user
    ? {
        name: googleSession.user.name ?? googleSession.user.email ?? 'there',
        email: googleSession.user.email ?? '',
      }
    : localSession;

  if (!user) redirect('/auth/signin');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-8 text-center">
      <h1 className="text-32 font-bold text-foreground">Welcome, {user.name}</h1>
      <p className="text-sm text-muted-foreground">{user.email}</p>
      <SignOutButton isGoogleSession={Boolean(googleSession?.user)} />
    </main>
  );
}
