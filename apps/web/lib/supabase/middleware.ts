import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Auth + terms-acceptance middleware.
 *
 * Two gates:
 *  1. Anything under /dashboard requires a Supabase session — otherwise we
 *     redirect to /sign-in with the original path captured in ?redirect=.
 *  2. Anything under /dashboard ALSO requires the local mirror to have
 *     acceptedTermsAt set — otherwise we redirect to /accept-terms.
 *
 * Signed-in users on /sign-in or /sign-up get punted to /dashboard.
 *
 * IMPORTANT: getUser() MUST run between createServerClient and the return —
 * that's what refreshes the Supabase session cookie. Skipping it is a known
 * Supabase footgun that produces stale sessions on every navigation.
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // getUser() refreshes the session cookie — must run before any return.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;
  const isDashboard = pathname.startsWith('/dashboard');
  const isAcceptTerms = pathname === '/accept-terms';
  const isAuthPage = pathname === '/sign-in' || pathname === '/sign-up';

  // Gate 1 — unauthenticated user on /dashboard or /accept-terms
  if ((isDashboard || isAcceptTerms) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/sign-in';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Gate 2 — authenticated user on /dashboard but terms not accepted yet.
  // We ask our API for the local mirror; if the call fails (network, API
  // down in dev) we let the request through rather than locking the user
  // out. The API will enforce the same rule on its own protected endpoints.
  if (isDashboard && user && session) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
    try {
      const res = await fetch(`${apiUrl}/api/me`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
        cache: 'no-store',
      });
      if (res.ok) {
        const me: { mirror: { acceptedTermsAt: string | null } | null } = await res.json();
        if (!me.mirror?.acceptedTermsAt) {
          const url = request.nextUrl.clone();
          url.pathname = '/accept-terms';
          return NextResponse.redirect(url);
        }
      }
    } catch {
      // API unreachable in dev — fall through. Production API outage would
      // surface via Sentry; we don't want to wedge users out of their data.
    }
  }

  // Signed-in users shouldn't see /sign-in or /sign-up.
  if (isAuthPage && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return response;
}
