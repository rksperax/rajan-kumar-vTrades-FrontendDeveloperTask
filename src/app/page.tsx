import { redirect } from 'next/navigation';
import { auth, signOut } from '@/auth';
import { SignOutButton } from '@/components/home/SignOutButton';

/**
 * Landing page for a signed-in user. Anyone without a session is sent to
 * sign-in, so `/` doubles as the post-login destination.
 */
export default async function Home() {
  const session = await auth();

  if (!session?.user) redirect('/auth/signin');

  const handleSignOut = async () => {
    'use server';
    await signOut({ redirectTo: '/auth/signin' });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-8 text-center">
      <h1 className="text-32 font-bold text-foreground">
        Welcome, {session.user.name ?? session.user.email}
      </h1>
      <p className="text-sm text-muted-foreground">{session.user.email}</p>
      <SignOutButton signOutAction={handleSignOut} />
    </main>
  );
}
