import 'server-only';

import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

import seedUsers from '@/data/users.json';

/**
 * A JSON file standing in for a database. The checked-in seed at
 * `src/data/users.json` is the starting state; writes go to that same file in
 * development so the data is visible in the repo.
 *
 * On a serverless host the project directory is read-only, so writes are
 * redirected to the temp directory. That copy is per-instance and does not
 * survive a redeploy — fine for a demo, but the reason a real app needs a
 * database rather than a file.
 */

export interface StoredUser {
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

/** A user as returned to the client; never carries the password hash. */
export interface PublicUser {
  email: string;
  name: string;
}

const IS_SERVERLESS = Boolean(process.env.VERCEL);

const DB_PATH = IS_SERVERLESS
  ? path.join(os.tmpdir(), 'vtrades-users.json')
  : path.join(process.cwd(), 'src', 'data', 'users.json');

export const hashPassword = (password: string) =>
  createHash('sha256').update(password).digest('hex');

export const normaliseEmail = (email: string) => email.trim().toLowerCase();

export const toPublicUser = (user: StoredUser): PublicUser => ({
  email: user.email,
  name: user.name,
});

/** Reads the database, falling back to the bundled seed on a fresh instance. */
export async function readUsers(): Promise<StoredUser[]> {
  try {
    const raw = await readFile(DB_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // No writable copy yet (or it is unreadable): start from the seed.
    return seedUsers as StoredUser[];
  }
}

/** Persists the whole collection back to the JSON file. */
export async function writeUsers(users: StoredUser[]): Promise<void> {
  await writeFile(DB_PATH, `${JSON.stringify(users, null, 2)}\n`, 'utf8');
}

/** Finds a user by address, or undefined when there is no account. */
export async function findUser(email: string): Promise<StoredUser | undefined> {
  const users = await readUsers();
  const address = normaliseEmail(email);
  return users.find((user) => user.email === address);
}
