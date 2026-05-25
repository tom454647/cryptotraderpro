import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Handles the OAuth + magic-link callback. Supabase redirects users here
 * with `?code=...`, we exchange the code for a session, then bounce to
 * `next` (default /dashboard).
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth failed — back to sign-in with a flag the page can read to show
  // a generic "something went wrong, try again" message.
  return NextResponse.redirect(`${origin}/sign-in?error=callback`);
}
