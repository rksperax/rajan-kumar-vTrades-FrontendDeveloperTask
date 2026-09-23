import { handlers } from '@/auth';

/**
 * Auth.js request handlers. This catch-all serves the provider, session and
 * OAuth callback endpoints; the sibling mock routes keep their own paths
 * because a static segment takes precedence over this catch-all.
 */
export const { GET, POST } = handlers;
