import dbConnect from "@/db/db";
import Admin from "@/models/admin";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await dbConnect();

    // 1. Get the Refresh Token from admin cookies
    const refreshToken = req.headers.get('cookie')
      ?.split(';')
      .find(c => c.trim().startsWith('shagun_admin_refresh='))
      ?.split('=')[1];

    if (!refreshToken) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    // 2. Verify the token signature
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { id: string };

    // 3. DB CHECK: Ensure the token in cookie matches the one in the Admin Model
    const admin = await Admin.findById(decoded.id);

    if (!admin || admin.refreshToken !== refreshToken) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    // 4. Generate new Access Token (15 minutes)
    const newAccessToken = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );

    const response = NextResponse.json({ success: true });

    // 5. Update the Admin Access Cookie
    response.cookies.set('shagun_admin_access', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 15 * 60,
    });

    return response;
  } catch (error) {
    console.error("Refresh Error:", error); // Helpful for logs
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
  }
}