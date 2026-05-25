import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Run on every path except Next internals, static files, and the
    // marketing legacy assets that don't need auth-cookie handling.
    '/((?!_next/static|_next/image|favicon.ico|brand-mark.svg|.*\\.(?:png|jpg|jpeg|gif|webp|svg)$).*)',
  ],
};
