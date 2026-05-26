import { NextResponse } from "next/server";
import Admin from "@/models/admin";
import OTP from "@/models/otp";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
      // 1. Increment failed attempts
      admin.loginAttempts += 1;
      await admin.save();

      // 2. If 5 attempts reached, trigger OTP
      if (admin.loginAttempts >= 5) {
        const directOTP = generateAlphanumericOTP(6);
        await OTP.deleteMany({ email: cleanEmail });
        await OTP.create({ email: cleanEmail, code: directOTP });

        await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: cleanEmail,
          subject: 'Security Alert: Verification Code',
          html: `Too many failed login attempts. Your security code is: <strong>${directOTP}</strong>`
        });

        return NextResponse.json({ message: "Too many failed attempts. OTP sent to your email.", step: "AWAITING_OTP" }, { status: 423 });
      }

      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // SUCCESS: Reset counter on successful password match
    admin.loginAttempts = 0;
    await admin.save();

    const accessToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET!, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: admin._id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });

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

    const response = NextResponse.json({ message: "Verified successfully" }, { status: 200 });
    response.cookies.set("shagun_admin_access", accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 900 });
    response.cookies.set("shagun_admin_refresh", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 604800 });
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Verification Failed" }, { status: 500 });
  }
};

export const adminLogout = async () => { // <--- No parameter here
  const response = NextResponse.json({ message: "Logged out" }, { status: 200 });
  response.cookies.set("shagun_admin_access", "", { maxAge: 0, path: "/" });
  response.cookies.set("shagun_admin_refresh", "", { maxAge: 0, path: "/" });
  return response;
};