import { createBrowserClient } from '@supabase/ssr';

/**
 * Supabase client for the browser. Reads cookies set by the server-side
 * middleware so sessions stay in sync across server and client components.
 *
 * Only uses publishable values (URL + anon key) — safe for the bundle.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
