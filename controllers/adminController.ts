import { NextResponse } from "next/server";
import Admin from "@/models/admin";
import OTP from "@/models/otp";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
import { LoginSchema, OtpVerifySchema, UpdateProfileSchema } from "@/schemas/authAdminSchemas";

const resend = new Resend(process.env.RESEND_API_KEY);
// Fallback to 2 minutes (120000ms) if ENV is missing
const OTP_COOLDOWN = Number(process.env.OTP_COOLDOWN_MS) || 120000;

interface TokenPayload {
  id: string;
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

const generateAlphanumericOTP = (length: number) => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

// Core helper to read the refresh token and extract the admin ID directly
const getAdminIdFromRefreshToken = (req: Request): string | null => {
  const cookieHeader = req.headers.get("cookie") || "";
  
  // Parse out the refresh token cookie string value
  const refreshToken = cookieHeader
    .split(";")
    .find((c) => c.trim().startsWith("shagun_admin_refresh="))
    ?.split("=")[1];

  if (!refreshToken) return null;

  try {
    // Verify the refresh token signature directly using your refresh secret
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as TokenPayload;
    return decoded.id;
  } catch (error) {
    return null; // Token is expired or tampered with
  }
};

// ==========================================
// AUTHENTICATION CONTROLLERS
// ==========================================

export const adminLogin = async (req: Request) => {
  try {
    const body = await req.json();

    // 1. Zod Validation (The Gatekeeper)
    const validation = LoginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
    }

    // 2. Data is already trimmed and lowercased by Zod
    const { email, password } = validation.data;
    const admin = await Admin.findOne({ email });

    if (!admin) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      admin.loginAttempts += 1;
      await admin.save();

      if (admin.loginAttempts >= 5) {
        const now = new Date();

        if (admin.lastOtpSentAt && (now.getTime() - admin.lastOtpSentAt.getTime() < OTP_COOLDOWN)) {
          const remainingSeconds = Math.ceil((OTP_COOLDOWN - (now.getTime() - admin.lastOtpSentAt.getTime())) / 1000);
          return NextResponse.json(
            { error: `Too many attempts. Please wait ${remainingSeconds} seconds before requesting a new code.` }, 
            { status: 429 }
          );
        }

        const directOTP = generateAlphanumericOTP(6);
        await OTP.deleteMany({ email });
        await OTP.create({ email, code: directOTP });

        admin.lastOtpSentAt = now;
        await admin.save();

        await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: email,
          subject: 'Security Alert: Verification Code',
          html: `Your security code is: <strong>${directOTP}</strong>`
        });

        return NextResponse.json({ message: "OTP sent to your email.", step: "AWAITING_OTP" }, { status: 423 });
      }

      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 3. SUCCESS: Reset all security tracking
    admin.loginAttempts = 0;
    admin.lastOtpSentAt = null; 
    await admin.save();

    const accessToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET!, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: admin._id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });

    admin.refreshToken = refreshToken;
    await admin.save();

    const response = NextResponse.json({ message: "Login successful" }, { status: 200 });
    response.cookies.set("shagun_admin_access", accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 900 });
    response.cookies.set("shagun_admin_refresh", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 604800 });
    return response;

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
};

export const verifyOTP = async (req: Request) => {
  try {
    const body = await req.json();

    // 1. Zod Validation
    const validation = OtpVerifySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
    }

    // 2. Data is already processed by Zod
    const { email, token } = validation.data;

    const otpRecord = await OTP.findOneAndDelete({ email, code: token });
    
    if (!otpRecord) return NextResponse.json({ error: "Invalid or expired code" }, { status: 401 });

    const admin = await Admin.findOne({ email });
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

export const refreshAccessToken = async (req: Request) => {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const refreshToken = cookieHeader
      .split(';')
      .find(c => c.trim().startsWith('shagun_admin_refresh='))
      ?.split('=')[1];

    if (!refreshToken) {
      return NextResponse.json({ error: "Unauthorized: No refresh token" }, { status: 401 });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { id: string };

    const newAccessToken = jwt.sign(
      { id: decoded.id }, 
      process.env.JWT_SECRET!, 
      { expiresIn: "15m" }
    );

    const response = NextResponse.json({ message: "Token refreshed successfully" }, { status: 200 });
    
    response.cookies.set("shagun_admin_access", newAccessToken, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", 
      sameSite: "lax", 
      path: "/", 
      maxAge: 900 
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Session expired, please login again" }, { status: 403 });
  }
};

export const adminLogout = async () => {
  const response = NextResponse.json({ message: "Logged out" }, { status: 200 });
  
  // Clear cookies by setting maxAge to 0
  response.cookies.set("shagun_admin_access", "", { maxAge: 0, path: "/" });
  response.cookies.set("shagun_admin_refresh", "", { maxAge: 0, path: "/" });
  
  return response;
};

// ==========================================
// PROFILE MANAGEMENT CONTROLLERS
// ==========================================

// FETCH PROFILE DATA
export const getAdminProfile = async (req: Request) => {
  try {
    const adminId = getAdminIdFromRefreshToken(req);
    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized: Session expired" }, { status: 401 });
    }

    const admin = await Admin.findById(adminId).select("-password -refreshToken");
    if (!admin) return NextResponse.json({ error: "Admin not found" }, { status: 404 });

    return NextResponse.json(admin, { status: 200 });
  } catch (error) {
    console.error("Fetch Profile Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
};

// UPDATE PROFILE DATA
export const updateAdminProfile = async (req: Request) => {
  try {
    const adminId = getAdminIdFromRefreshToken(req);
    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized: Session expired" }, { status: 401 });
    }

    const body = await req.json();
    const validation = UpdateProfileSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
    }

    const { username, email, mobile, password } = validation.data;
    const admin = await Admin.findById(adminId);
    if (!admin) return NextResponse.json({ error: "Admin not found" }, { status: 404 });

    if (email !== admin.email) {
      const existingEmail = await Admin.findOne({ email });
      if (existingEmail) return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    admin.username = username;
    admin.email = email;
    admin.mobile = mobile;

    if (password && password.trim() !== "") {
      admin.password = await bcrypt.hash(password, 10);
    }

    await admin.save();

    return NextResponse.json({ 
      message: "Profile updated successfully",
      admin: { username: admin.username, email: admin.email, mobile: admin.mobile }
    }, { status: 200 });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
};