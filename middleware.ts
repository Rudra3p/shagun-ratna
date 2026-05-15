import { NextRequest, NextResponse } from 'next/server';
import { adminMiddleware } from './middlewares/adminMiddleware';
import { userMiddleware } from './middlewares/userMiddleware';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Route to Admin Logic
  if (pathname.startsWith('/admin')) {
    // Public exception for the login page
    if (pathname === '/admin/login') return NextResponse.next();
    
    const adminResponse = await adminMiddleware(request);
    return adminResponse || NextResponse.next();
  }

  // 2. Public exception for the Landing Page
  if (pathname === '/') {
    return NextResponse.next();
  }

  // 3. Route to User Logic (Profile, Settings, etc.)
  const userResponse = await userMiddleware(request);
  return userResponse || NextResponse.next();
}

export const config = {
  // Protects everything except static files and Next.js internals
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};