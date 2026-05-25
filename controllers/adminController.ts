import Admin from "@/models/admin";
import OTP from "@/models/otp"; // 🔥 Verified: Imports the dedicated OTP Model
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import NodeMailjet from "node-mailjet";

// Initialize Mailjet Client
const mailjet = new NodeMailjet({
  apiKey: process.env.MJ_APIKEY_PUBLIC || "",
  apiSecret: process.env.MJ_APIKEY_PRIVATE || ""
});

// =========================================================================
// ─── SEPARATED GLOBAL IN-MEMORY RATELIMIT MANAGERS ───────────────────────
// =========================================================================
interface IAccountRateLimit {
  count: number;
  strikeTier: number;
  lockUntil: number;
}

interface IIpRateLimit {
  count: number;      
  strikeTier: number; // 1 = 5-minute block, 2 = 14-hour block
  lockUntil: number;  
}

// Path 1 Tracker: Keyed by Admin Email string strictly
const adminAccountStore = new Map<string, IAccountRateLimit>();

// Path 2 Tracker: Keyed by Attacker Client IP string strictly
const maliciousIpStore = new Map<string, IIpRateLimit>();

// Secure Alphanumeric OTP Generator (e.g., R45DS9)
const generateAlphanumericOTP = (length = 6): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += chars[randomBytes[i] % chars.length];
  }
  return result;
};

// =========================================================================
// STEP 1: VERIFY PASSWORD & EMAIL -> DISPATCH & STORE DEDICATED OTP
// =========================================================================
export const adminLogin = async (req: Request) => {
  try {
    const currentTime = Date.now();

    // ─── 1. MULTI-PLATFORM IP EXTRACTION ────────────────────────────────────
    const ip = 
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() || 
      req.headers.get("x-real-ip") ||                            
      req.headers.get("cf-connecting-ip") ||                    
      "127.0.0.1";                                               

    // ─── 2. CHECK PATH 2 IP BLOCK CONDITIONS (WRONG EMAIL DEFENSE) ──────────
    const ipTrack = maliciousIpStore.get(ip);
    if (ipTrack && ipTrack.lockUntil > currentTime) {
      const remainingTime = ipTrack.lockUntil - currentTime;
      let timeString = remainingTime > 60 * 60 * 1000 
        ? `${Math.ceil(remainingTime / 3600000)} hours` 
        : `${Math.ceil(remainingTime / 60000)} minutes`;

      return NextResponse.json(
        { error: `Access Denied. Suspicious network activity. Try again in ${timeString}.` },
        { status: 429 }
      );
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    // ─── 3. CHECK PATH 1 ACCOUNT LOCK CONDITIONS (REAL ADMIN PASSWORD TYPOS) ───
    const accountTrack = adminAccountStore.get(cleanEmail);
    if (accountTrack && accountTrack.lockUntil > currentTime) {
      const remainingTime = accountTrack.lockUntil - currentTime;
      const minutesLeft = Math.ceil(remainingTime / 60000);
      return NextResponse.json(
        { error: `Too many failed password attempts. Account locked. Try again in ${minutesLeft} minutes.` },
        { status: 423 }
      );
    }

    // ─── 4. DATABASE LOOKUP ──────────────────────────────────────────────────
    const admin = await Admin.findOne({ email: cleanEmail });

    // 🛑 PATH 2 EXECUTION: EMAIL WRONG -> EXECUTE IP BANS
    if (!admin) {
      const currentIpTrack = maliciousIpStore.get(ip) || { count: 0, strikeTier: 0, lockUntil: 0 };
      currentIpTrack.count += 1;
      
      if (currentIpTrack.count >= 5) {
        currentIpTrack.strikeTier += 1;
        currentIpTrack.count = 0; 

        if (currentIpTrack.strikeTier === 1) {
          currentIpTrack.lockUntil = Date.now() + 5 * 60 * 1000; // 1st tier: 5 mins block
        } else {
          currentIpTrack.lockUntil = Date.now() + 14 * 60 * 60 * 1000; // 2nd tier+: 14 hours block
        }
      }
      
      maliciousIpStore.set(ip, currentIpTrack);
      
      const attemptsRemaining = 5 - currentIpTrack.count;
      return NextResponse.json({ 
        error: "Invalid Credentials",
        attemptsRemaining: currentIpTrack.lockUntil > Date.now() ? 0 : attemptsRemaining
      }, { status: 401 });
    }

    // ─── 5. VERIFY PASSWORD MATCH (EMAIL FOUND) ─────────────────────────────
    const isMatch = await bcrypt.compare(password, admin.password);

    // 🛑 PATH 1 EXECUTION: EMAIL RIGHT BUT PASSWORD WRONG
    if (!isMatch) {
      const currentTrack = adminAccountStore.get(cleanEmail) || { count: 0, strikeTier: 0, lockUntil: 0 };
      currentTrack.count += 1;

      if (currentTrack.count >= 5) {
        currentTrack.strikeTier += 1;
        currentTrack.count = 0; 

        if (currentTrack.strikeTier === 1) {
          currentTrack.lockUntil = Date.now() + 2 * 60 * 1000;   // Strike 1: 2 mins lock
        } else if (currentTrack.strikeTier === 2) {
          currentTrack.lockUntil = Date.now() + 5 * 60 * 1000;   // Strike 2: 5 mins lock
        } else {
          currentTrack.lockUntil = Date.now() + 10 * 60 * 1000;  // Strike 3+: 10 mins lock
        }
      }

      adminAccountStore.set(cleanEmail, currentTrack);
      return NextResponse.json({ 
        error: "Invalid Credentials", 
        attemptsRemaining: currentTrack.lockUntil > Date.now() ? 0 : 5 - currentTrack.count 
      }, { status: 401 });
    }

    // ─── 🎉 HIGHWAY PATH: CREDENTIALS FULLY VERIFIED ────────────────────────
    adminAccountStore.delete(cleanEmail); // Wipes memory track on success
    maliciousIpStore.delete(ip);          // Wipes network track on success

    const directOTP = generateAlphanumericOTP(6);

    // 🔥 SAVE CODE TO THE DEDICATED MODEL INSTEAD OF ADMIN SCHEMA
    await OTP.deleteMany({ email: cleanEmail }); // Clear any stale codes hanging around
    await OTP.create({
      email: cleanEmail,
      code: directOTP
    });

    // Deliver Direct OTP using Mailjet Template
    try {
      await mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: {
              Email: process.env.MAIL_FROM_EMAIL || "no-reply@fitgymos.com",
              Name: process.env.MAIL_FROM_NAME || "Shagun Ratna"
            },
            To: [{ Email: admin.email, Name: "Administrator" }],
            Subject: "🔑 Secure Portal Gateway: Your OTP Verification Code",
            TextPart: `Your secure administrative access code is: ${directOTP}. It expires in 5 minutes.`,
            HTMLPart: `
              <div style="font-family: sans-serif; padding: 20px; max-width: 500px; border: 1px solid #2A0005; border-radius: 12px; background-color: #FCF8F2;">
                <h2 style="color: #5C0612;">Dashboard Verification Requested</h2>
                <p style="color: #333;">Your primary credentials have been successfully verified. Use the security code below to complete your administrative login:</p>
                <div style="margin: 30px 0; text-align: center;">
                  <span style="background-color: #5C0612; color: #FFFFFF; padding: 12px 35px; border-radius: 8px; font-size: 26px; font-family: monospace; font-weight: bold; letter-spacing: 5px; display: inline-block;">${directOTP}</span>
                </div>
                <p style="font-size: 0.8rem; color: #640a17;">This security code is strictly single-use and expires in 5 minutes.</p>
              </div>
            `
          }
        ]
      });
      console.log(`[MAILJET SUCCESS] OTP Code dispatched securely to: ${admin.email}`);
    } catch (mailError) {
      console.error("[MAILJET ERROR] System fallback engaged:");
      console.log(`\n🔑 [LOCAL DEV OTP DEBUG] CODE: ${directOTP}\n`);
    }

    return NextResponse.json({ 
      message: "Credentials approved. Enter the verification code sent to your email.",
      step: "AWAITING_OTP"
    }, { status: 200 });

  } catch (error) {
    console.error("Admin Login Step 1 Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

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