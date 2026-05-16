import { NextRequest, NextResponse } from 'next/server';
import { adminMiddleware } from './middlewares/adminMiddleware';
import { userMiddleware } from './middlewares/userMiddleware';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Let Next.js API routes pass through cleanly
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // 2. ISOLATED ADMIN ROUTING
  if (pathname.startsWith('/admin')) {
    // Public exception for the admin login page
    if (pathname === '/admin/login') return NextResponse.next();
    
    const adminResponse = await adminMiddleware(request);
    return adminResponse || NextResponse.next();
  }

  // 3. ISOLATED USER ROUTING
  // This ensures user logic NEVER touches admin paths or the root landing page
  if (pathname.startsWith('/user')) {
    // Public exception for the user login page (if you build one later)
    if (pathname === '/user/login' || pathname === '/login') return NextResponse.next();

    const userResponse = await userMiddleware(request);
    return userResponse || NextResponse.next();
  }

  // 4. Public exceptions for landing pages or marketing pages
  if (pathname === '/') {
    return NextResponse.next();
  }

  // Fallback for any other unmatched public paths
  return NextResponse.next();
}

export const config = {
  // Protects everything except static assets and Next.js internals
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};