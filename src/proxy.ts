import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

// Routes that do NOT require authentication
const PUBLIC_ROUTES = ['/login', '/register', '/verify', '/forgot-password'];

// Routes that authenticated users should not visit (auth pages)
const AUTH_ROUTES = ['/login', '/register'];

function hasSession(request: NextRequest): boolean {
  return request.cookies.has('ch_demo_session');
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthRoute = AUTH_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'));
  const isPublicRoute = PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'));
  const isApi = pathname.startsWith('/api/');

  const loggedIn = hasSession(request);

  // Redirect logged-in users away from login/register → home
  if (isAuthRoute && loggedIn) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect unauthenticated users away from protected routes → login
  if (!isPublicRoute && !isApi && !loggedIn) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
