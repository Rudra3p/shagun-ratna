import { NextRequest, NextResponse } from 'next/server';
import { adminMiddleware } from './middlewares/adminMiddleware';
// 1. Comment out the import if you aren't using it
// import { userMiddleware } from './middlewares/userMiddleware';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let Axios talk to your API endpoints directly without interference
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // 2. Route to Admin Logic
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') return NextResponse.next();
    
    const adminResponse = await adminMiddleware(request);
    return adminResponse || NextResponse.next();
  }

  // 3. Public exception for the Landing Page
  if (pathname === '/') {
    return NextResponse.next();
  }

  // 4. SAFELY BYPASS USER MIDDLEWARE
  // Since userMiddleware is commented out, just let all other paths load freely
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};