import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function userMiddleware(request: NextRequest) {
  // Get the User-specific tokens
  const userAccess = request.cookies.get('shagun_user_access')?.value;
  const userRefresh = request.cookies.get('shagun_user_refresh')?.value;

  // If no tokens found, safely redirect them to the sign in / register page
  if (!userAccess && !userRefresh) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // If access token is missing but refresh token exists, let them pass to hit the refresh API
  if (!userAccess && userRefresh) {
    return NextResponse.next();
  }

  try {
    // Verify the User JWT signature
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(userAccess!, secret);

    return NextResponse.next();
  } catch (error) {
    // If verification fails but refresh cookie is there, let the frontend refresh route try to fix it
    if (userRefresh) return NextResponse.next();

    return NextResponse.redirect(new URL('/auth', request.url));
  }
}