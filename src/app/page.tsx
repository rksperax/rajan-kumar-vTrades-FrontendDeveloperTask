import { redirect } from 'next/navigation';

/** The app has a single screen for now, so the root sends visitors to sign-in. */
export default function Home() {
  redirect('/auth/signin');
}
