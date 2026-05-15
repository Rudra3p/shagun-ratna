import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose'; 

export async function adminMiddleware(request: NextRequest) {
  const accessToken = request.cookies.get('shagun_admin_access')?.value;
  const refreshToken = request.cookies.get('shagun_admin_refresh')?.value;

  // 1. No tokens found? Force Login.
  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // 2. Access Token is missing, but Refresh Token exists.
  // We let them through so the frontend can hit the /api/admin/refresh route
  // which will then check the Database Model.
  if (!accessToken && refreshToken) {
    return NextResponse.next();
  }

  try {
    // 3. Verify Access Token signature with your Secret
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(accessToken!, secret);
    
    return NextResponse.next();
  } catch (error) {
    // If access token is expired/invalid, but refresh token is there,
    // allow the request so the auto-refresh API can try to fix it.
    if (refreshToken) return NextResponse.next();
    
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
}