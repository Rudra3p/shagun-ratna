import Admin from "@/models/admin";
import OTP from "@/models/otp";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
// Fallback to CommonJS require to avoid missing type declarations.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer: any = require("nodemailer");
import { google } from "googleapis";

// Account-level rate-limit/attempt tracker
const adminAccountStore = new Map<string, { attempts: number; lockUntil?: number }>();

// Initialize OAuth2 Client
const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

// Helper to create Transporter
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

// Generate alphanumeric OTP
const generateAlphanumericOTP = (length: number): string => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return otp;
};

export const adminLogin = async (req: Request) => {
  try {
    const { email, password } = await req.json();
    const cleanEmail = email.toLowerCase().trim();

    // 1. Check for lockout
    const accountStatus = adminAccountStore.get(cleanEmail);
    if (accountStatus?.lockUntil && Date.now() < accountStatus.lockUntil) {
      return NextResponse.json({ error: "Account locked. Try again in 15 minutes." }, { status: 423 });
    }

    const admin = await Admin.findOne({ email: cleanEmail });

    // 2. Validate Credentials
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      const attempts = (accountStatus?.attempts || 0) + 1;
      
      if (attempts >= 5) {
        adminAccountStore.set(cleanEmail, { attempts, lockUntil: Date.now() + 15 * 60 * 1000 });
        return NextResponse.json({ error: "Too many failed attempts. Account locked." }, { status: 423 });
      }

      adminAccountStore.set(cleanEmail, { attempts });
      return NextResponse.json({ error: `Invalid credentials. ${5 - attempts} attempts left.` }, { status: 401 });
    }

    // 3. Success: Reset attempts and trigger OTP
    adminAccountStore.delete(cleanEmail);
    const directOTP = generateAlphanumericOTP(6);
    await OTP.deleteMany({ email: cleanEmail });
    await OTP.create({ email: cleanEmail, code: directOTP });

    // (Include your existing mailer code here)

    return NextResponse.json({ message: "OTP sent to email.", step: "AWAITING_OTP" }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

// ... (Keep your existing verifyOTP and adminLogout functions)

// =========================================================================
// STEP 2: VERIFY SUBMITTED OTP INPUT CODE FROM ISOLATED MODEL
// =========================================================================
export const verifyOTP = async (req: Request) => {
  try {
    const { email, token } = await req.json();

    if (!email || !token) {
      return NextResponse.json({ error: "Missing required validation parameters" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanToken = token.trim().toUpperCase();

    // 🔥 FIND RECORD WITHIN THE DEDICATED OTP COLLECTION
    const otpRecord = await OTP.findOne({ email: cleanEmail, code: cleanToken });

    // If it's missing, it's either an invalid code or MongoDB TTL already auto-deleted it!
    if (!otpRecord) {
      return NextResponse.json({ error: "The code has expired or is invalid. Please request a new one." }, { status: 401 });
    }

    // Grab corresponding admin schema profile to create the cookie tokens
    const admin = await Admin.findOne({ email: cleanEmail });
    if (!admin) {
      return NextResponse.json({ error: "Access Denied" }, { status: 404 });
    }

    // 🔥 INSTANTLY FLUSH RECORD SO IT CAN NEVER BE REPLAYED TWICE
    await OTP.deleteOne({ _id: otpRecord._id });

    // Generate JWT Web Tokens
    const accessToken = jwt.sign(
      { id: admin._id }, 
      process.env.JWT_SECRET as string, 
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: admin._id }, 
      process.env.JWT_REFRESH_SECRET as string, 
      { expiresIn: "7d" }
    );

    // Save session context tracking
    admin.refreshToken = refreshToken;
    admin.loginAttempts = 0;      
    admin.lockUntil = null;       
    await admin.save();

    const response = NextResponse.json(
      { message: "Welcome back, Boss. Legend Mode Active." }, 
      { status: 200 }
    );

    // Save session payload into secure httpOnly cookies
    response.cookies.set("shagun_admin_access", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    response.cookies.set("shagun_admin_refresh", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Admin OTP Verification Step 2 Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

// =========================================================================
// STEP 3: LOGOUT TERMINATION
// =========================================================================
export const adminLogout = async (req: Request) => {
  try {
    const response = NextResponse.json({ message: "Admin logged out successfully" }, { status: 200 });
    
    response.cookies.set("shagun_admin_access", "", { maxAge: 0, path: "/" });
    response.cookies.set("shagun_admin_refresh", "", { maxAge: 0, path: "/" });
    
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Logout execution encountered a failure" }, { status: 500 });
  }
};