import { NextResponse } from "next/server";
import Admin from "@/models/admin";
import OTP from "@/models/otp";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { google } from "googleapis";
const nodemailer = require("nodemailer");

// --- Configuration ---
const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

const createTransporter = async () => {
  const accessToken = await oAuth2Client.getAccessToken();
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.GMAIL_USER,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      accessToken: accessToken.token,
    },
  });
};

const generateAlphanumericOTP = (length: number) => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

// --- Handlers ---

export const adminLogin = async (req: Request) => {
  try {
    const { email, password } = await req.json();
    const cleanEmail = email.toLowerCase().trim();
    const admin = await Admin.findOne({ email: cleanEmail });

    if (!admin) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const isMatch = await bcrypt.compare(password, admin.password);

    if (isMatch) {
      const accessToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET!, { expiresIn: "15m" });
      const refreshToken = jwt.sign({ id: admin._id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });

      const response = NextResponse.json({ message: "Login successful" }, { status: 200 });
      response.cookies.set("shagun_admin_access", accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 900 });
      response.cookies.set("shagun_admin_refresh", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 604800 });
      return response;
    }

    // Handle Failures & Trigger OTP
    const directOTP = generateAlphanumericOTP(6);
    await OTP.deleteMany({ email: cleanEmail });
    await OTP.create({ email: cleanEmail, code: directOTP });

    const transporter = await createTransporter();
    await transporter.sendMail({
      from: `"Shagun Ratna" <${process.env.GMAIL_USER}>`,
      to: cleanEmail,
      subject: "Security Alert: Verification Code",
      html: `Your verification code is: <b>${directOTP}</b>`
    });

    return NextResponse.json({ message: "OTP sent to your email.", step: "AWAITING_OTP" }, { status: 423 });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
};

export const verifyOTP = async (req: Request) => {
  try {
    const { email, token } = await req.json();
    const cleanEmail = email.toLowerCase().trim();
    const cleanToken = token.trim().toUpperCase();

    // Use findOneAndDelete to ensure atomic verification and single-use logic
    const otpRecord = await OTP.findOneAndDelete({ email: cleanEmail, code: cleanToken });
    
    if (!otpRecord) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 401 });
    }

    const admin = await Admin.findOne({ email: cleanEmail });
    if (!admin) return NextResponse.json({ error: "Access Denied" }, { status: 404 });

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

export const adminLogout = async () => {
  const response = NextResponse.json({ message: "Logged out" }, { status: 200 });
  response.cookies.set("shagun_admin_access", "", { maxAge: 0, path: "/" });
  response.cookies.set("shagun_admin_refresh", "", { maxAge: 0, path: "/" });
  return response;
};