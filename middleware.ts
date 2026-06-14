import { NextRequest, NextResponse } from 'next/server';
import { adminMiddleware } from './middlewares/adminMiddleware';
import { userMiddleware } from './middlewares/userMiddleware';

export async function middleware(request: NextRequest) {
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

  // 3. ADMIN UI PROTECTION
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') return NextResponse.next();
    const adminResponse = await adminMiddleware(request);
    return adminResponse || NextResponse.next();
  }

  // 4. USER UI PROTECTION
  if (pathname.startsWith('/user')) {
    if (pathname === '/user/signin' || pathname === '/signin') return NextResponse.next();
    const userResponse = await userMiddleware(request);
    return userResponse || NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  // Protects everything except static assets and Next.js internals
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};