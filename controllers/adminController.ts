import { NextResponse } from "next/server";
import Admin from "@/models/admin";
import OTP from "@/models/otp";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Resend } from "resend";

export const refreshAccessToken = async (req: Request) => {
  try {
    // 1. Get the refresh token from the browser cookies
    const cookieHeader = req.headers.get("cookie") || "";
    const refreshToken = cookieHeader
      .split(';')
      .find(c => c.trim().startsWith('shagun_admin_refresh='))
      ?.split('=')[1];

    if (!refreshToken) {
      return NextResponse.json({ error: "Unauthorized: No refresh token" }, { status: 401 });
    }

    // 2. Verify the refresh token using your secret
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { id: string };

    // 3. Generate a brand new, short-lived Access Token
    const newAccessToken = jwt.sign(
      { id: decoded.id }, 
      process.env.JWT_SECRET!, 
      { expiresIn: "15m" }
    );

    // 4. Send the new Access Token back in an httpOnly cookie
    const response = NextResponse.json({ message: "Token refreshed successfully" }, { status: 200 });
    
    response.cookies.set("shagun_admin_access", newAccessToken, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", 
      sameSite: "lax", 
      path: "/", 
      maxAge: 900 // 15 minutes
    });

    return response;
  } catch (error) {
    // If the refresh token is expired or invalid, force logout
    return NextResponse.json({ error: "Session expired, please login again" }, { status: 403 });
  }
};

const resend = new Resend(process.env.RESEND_API_KEY);
// Fallback to 2 minutes (120000ms) if ENV is missing
const OTP_COOLDOWN = Number(process.env.OTP_COOLDOWN_MS) || 120000;

const generateAlphanumericOTP = (length: number) => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

export const adminLogin = async (req: Request) => {
  try {
    const { email, password } = await req.json();
    const cleanEmail = email.toLowerCase().trim();
    const admin = await Admin.findOne({ email: cleanEmail });

    if (!admin) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      admin.loginAttempts += 1;
      await admin.save();

      if (admin.loginAttempts >= 5) {
        const now = new Date();

        // Check cooldown: If last sent was < OTP_COOLDOWN, block the email
        if (admin.lastOtpSentAt && (now.getTime() - admin.lastOtpSentAt.getTime() < OTP_COOLDOWN)) {
          const remainingSeconds = Math.ceil((OTP_COOLDOWN - (now.getTime() - admin.lastOtpSentAt.getTime())) / 1000);
          return NextResponse.json(
            { error: `Too many attempts. Please wait ${remainingSeconds} seconds before requesting a new code.` }, 
            { status: 429 }
          );
        }

        // Generate and send new OTP
        const directOTP = generateAlphanumericOTP(6);
        await OTP.deleteMany({ email: cleanEmail });
        await OTP.create({ email: cleanEmail, code: directOTP });

        // Update the cooldown timestamp
        admin.lastOtpSentAt = now;
        await admin.save();

        await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: cleanEmail,
          subject: 'Security Alert: Verification Code',
          html: `Your security code is: <strong>${directOTP}</strong>`
        });

        return NextResponse.json({ message: "OTP sent to your email.", step: "AWAITING_OTP" }, { status: 423 });
      }

      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // SUCCESS: Reset all security tracking
    admin.loginAttempts = 0;
    admin.lastOtpSentAt = null; 
    await admin.save();

    // ... (JWT and Cookie logic remains the same)
    const accessToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET!, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: admin._id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });

    admin.refreshToken = refreshToken;
    await admin.save();

    const response = NextResponse.json({ message: "Login successful" }, { status: 200 });
    response.cookies.set("shagun_admin_access", accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 900 });
    response.cookies.set("shagun_admin_refresh", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 604800 });
    return response;

  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
};

export const verifyOTP = async (req: Request) => {
  try {
    const { email, token } = await req.json();
    const cleanEmail = email.toLowerCase().trim();
    const cleanToken = token.trim().toUpperCase();

    const otpRecord = await OTP.findOneAndDelete({ email: cleanEmail, code: cleanToken });
    
    if (!otpRecord) return NextResponse.json({ error: "Invalid or expired code" }, { status: 401 });

    const admin = await Admin.findOne({ email: cleanEmail });
    if (!admin) return NextResponse.json({ error: "Access Denied" }, { status: 404 });

    // Reset attempts on successful OTP verification
    admin.loginAttempts = 0;
    await admin.save();

    const accessToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET!, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: admin._id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });

    admin.refreshToken = refreshToken;
    await admin.save();

    const response = NextResponse.json({ message: "Verified successfully" }, { status: 200 });
    response.cookies.set("shagun_admin_access", accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 900 });
    response.cookies.set("shagun_admin_refresh", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 604800 });
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Verification Failed" }, { status: 500 });
  }
};

export const adminLogout = async () => {
  const response = NextResponse.json({ message: "Logged out" }, { status: 200 });
  
  // Clear cookies by setting maxAge to 0
  response.cookies.set("shagun_admin_access", "", { maxAge: 0, path: "/" });
  response.cookies.set("shagun_admin_refresh", "", { maxAge: 0, path: "/" });
  
  return response;
};