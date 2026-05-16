// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import { jwtVerify } from 'jose';

// export async function userMiddleware(request: NextRequest) {
//   // 1. Get the User-specific tokens
//   const userAccess = request.cookies.get('shagun_user_access')?.value;
//   const userRefresh = request.cookies.get('shagun_user_refresh')?.value;

//   // 2. If no tokens, redirect to the main user login (not admin login!)
//   if (!userAccess && !userRefresh) {
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

//   // 3. If access is gone but refresh exists, let them pass to hit the refresh API
//   if (!userAccess && userRefresh) {
//     return NextResponse.next();
//   }

//   try {
//     // 4. Verify the User JWT
//     // (Pro-tip: You can use a different secret for users if you want extreme security)
//     const secret = new TextEncoder().encode(process.env.JWT_SECRET);
//     await jwtVerify(userAccess!, secret);
    
//     return NextResponse.next();
//   } catch (error) {
//     // If access token failed but refresh exists, give the API a chance to fix it
//     if (userRefresh) return NextResponse.next();
    
//     return NextResponse.redirect(new URL('/login', request.url));
//   }
// }