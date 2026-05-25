import Admin from "@/models/admin";
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

// --- GLOBAL IN-MEMORY IP + EMAIL TRACKER (RAM) ---
interface IRateLimit {
  count: number;       // Tracks attempts within the current tier (0 to 5)
  strikeTier: number;  // Tracks how many times they have been locked out (0, 1, 2, 3+)
  lockUntil: number;   // Timestamp when the current lockout expires
}
const globalRateLimitStore = new Map<string, IRateLimit>();

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
// STEP 1: VERIFY PASSWORD & EMAIL -> DISPATCH 6-CHARACTER OTP
// =========================================================================
export const adminLogin = async (req: Request) => {
  try {
    const currentTime = Date.now();

    // Multi-Platform IP Extraction
    const ip = 
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() || 
      req.headers.get("x-real-ip") ||                            
      req.headers.get("cf-connecting-ip") ||                    
      "127.0.0.1";                                               

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const rateLimitKey = `${ip}:${cleanEmail}`;

    // 1. Check Rate Limit Status for this IP + Email combination
    const ipTrack = globalRateLimitStore.get(rateLimitKey);
    if (ipTrack && ipTrack.lockUntil > currentTime) {
      const remainingTime = ipTrack.lockUntil - currentTime;
      
      let timeString = "";
      if (remainingTime > 60 * 60 * 1000) {
        timeString = `${Math.ceil(remainingTime / 3600000)} hours`;
      } else if (remainingTime > 60 * 1000) {
        timeString = `${Math.ceil(remainingTime / 60000)} minutes`;
      } else {
        timeString = `${Math.ceil(remainingTime / 1000)} seconds`;
      }

      return NextResponse.json(
        { error: `Too many login attempts. Access blocked. Try again in ${timeString}.` },
        { status: 429 }
      );
    }

    // 2. Query DB for Admin profile
    const admin = await Admin.findOne({ email: cleanEmail });

    // ─── SPLIT SECURITY FAILURE HANDLER ───
    const handleFailure = async (isAdminFound: boolean) => {
      const currentTrack = globalRateLimitStore.get(rateLimitKey) || { count: 0, strikeTier: 0, lockUntil: 0 };
      currentTrack.count += 1;

      if (isAdminFound) {
        // RULE 1: REAL ADMIN EMAIL (Escalating short penalties)
        if (currentTrack.count >= 5) {
          currentTrack.strikeTier += 1;
          currentTrack.count = 0; 

          if (currentTrack.strikeTier === 1) {
            currentTrack.lockUntil = Date.now() + 2 * 60 * 1000;  // Try 1: 2 mins lock
          } else if (currentTrack.strikeTier === 2) {
            currentTrack.lockUntil = Date.now() + 5 * 60 * 1000;  // Try 2: 5 mins lock
          } else {
            currentTrack.lockUntil = Date.now() + 10 * 60 * 1000; // Try 3+: 10 mins lock
          }
        }
        
        if (admin) {
          admin.loginAttempts += 1;
          await admin.save();
        }
      } else {
        // RULE 2: DIFFERENT / UNMATCHED EMAIL (Brute-force dynamic ban)
        if (currentTrack.count >= 5) {
          currentTrack.lockUntil = Date.now() + 14 * 60 * 60 * 1000; // 14 Hours Block
          currentTrack.count = 0;
        }
      }

      globalRateLimitStore.set(rateLimitKey, currentTrack);

      const attemptsRemaining = 5 - currentTrack.count;
      return NextResponse.json({ 
        error: "Invalid Credentials", 
        attemptsRemaining: currentTrack.lockUntil > Date.now() ? 0 : attemptsRemaining 
      }, { status: 401 });
    };

    // If email is wrong, trigger 14-hour system defense rule immediately
    if (!admin) return handleFailure(false);

    // Check Account Lock Status in MongoDB
    if (admin.lockUntil && new Date() < admin.lockUntil) {
      return NextResponse.json({ error: "Account locked temporarily. Try again later." }, { status: 423 });
    }

    // 3. Verify Password Match
    const isMatch = await bcrypt.compare(password, admin.password);

    // If password fails, execute Admin Tiered Penalty rule
    if (!isMatch) {
      return handleFailure(true);
    }

    // ─── CREDENTIALS PASSED: GENERATE AND EMAIL OTP ───
    globalRateLimitStore.delete(rateLimitKey); // Clear temporary rate limit cache

    const directOTP = generateAlphanumericOTP(6);

    admin.otp = directOTP;
    admin.otptimeout = new Date(Date.now() + 5 * 60 * 1000); // Code valid for 5 mins
    admin.loginAttempts = 0; 
    admin.lockUntil = null;
    await admin.save();

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
// STEP 2: VERIFY SUBMITTED OTP INPUT CODE & ISSUE COOKIES
// =========================================================================
export const verifyOTP = async (req: Request) => {
  try {
    // Frontend should POST data directly to this endpoint: { "email": "...", "token": "R45DS9" }
    const { email, token } = await req.json();

    if (!email || !token) {
      return NextResponse.json({ error: "Missing required validation parameters" }, { status: 400 });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return NextResponse.json({ error: "Access Denied" }, { status: 404 });
    }

    // Check expiration boundaries
    if (!admin.otp || !admin.otptimeout || new Date() > admin.otptimeout) {
      return NextResponse.json({ error: "The code has expired or is invalid. Please request a new one." }, { status: 400 });
    }

    // Validate string inputs securely (Normalizes case mismatches)
    if (admin.otp.toUpperCase() !== token.toUpperCase().trim()) {
      return NextResponse.json({ error: "Invalid security verification code." }, { status: 401 });
    }

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

    // Reset temporary document auth properties
    admin.refreshToken = refreshToken;
    admin.otp = null;
    admin.otptimeout = null;
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