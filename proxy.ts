import { NextResponse } from 'next/server';
import type { NextRequest, NextFetchEvent } from 'next/server';
import { adminMiddleware } from './middlewares/adminMiddleware';
import { userMiddleware } from './middlewares/userMiddleware';
import { trackVisit } from './lib/trackVisit';

const VISIT_COOKIE = 'sr_visit_date';

export async function proxy(request: NextRequest, event: NextFetchEvent) {
  const { pathname } = request.nextUrl;

  // 1. SECURE ADMIN APIs (LOCKED)
  if (pathname.startsWith('/api/admin')) {
    console.log("Admin API Access Attempted:", pathname);
    // These specific admin routes are FREE (Public)
    if (pathname === '/api/admin/login' || pathname === '/api/admin/refresh') {
      return NextResponse.next();
    }
    // All other /api/admin/* routes are PROTECTED
    return await adminMiddleware(request);
  }

  // 2. OTHER APIS (FREE)
  // This now only affects APIs that ARE NOT /api/admin
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // 3. ADMIN UI PROTECTION (internal traffic — not counted as a storefront visit)
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') return NextResponse.next();
    const adminResponse = await adminMiddleware(request);
    return adminResponse || NextResponse.next();
  }

  // 4. USER UI PROTECTION (real account-only pages — not the public storefront)
  // Liked Collection is intentionally open: it's backed by localStorage, not an
  // account, so anyone can use the wishlist without signing in first.
  const USER_PROTECTED_PATHS = ['/profile'];
  let response: NextResponse;
  if (USER_PROTECTED_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    response = (await userMiddleware(request)) || NextResponse.next();
  } else {
    response = NextResponse.next();
  }

  // 5. VISITOR TRACKING (storefront pages only, once per visitor per day)
  const todayKey = new Date().toISOString().slice(0, 10);
  if (request.cookies.get(VISIT_COOKIE)?.value !== todayKey) {
    event.waitUntil(trackVisit(todayKey));
    response.cookies.set(VISIT_COOKIE, todayKey, {
      path: '/',
      maxAge: 60 * 60 * 24,
      sameSite: 'lax',
    });
  }

  return response;
}

export const config = {
  // Protects everything except static assets and Next.js internals
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};