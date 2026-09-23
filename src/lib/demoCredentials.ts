/**
 * The seeded account from `src/data/users.json`. The sign-in form starts
 * pre-filled with these so a reviewer can sign in with one click.
 *
 * The password lives here rather than in the database file, which only stores
 * its hash — keep the two in step if either changes.
 */
export const DEMO_CREDENTIALS = {
  email: 'navinash@workhive.com',
  password: '12345678',
} as const;
