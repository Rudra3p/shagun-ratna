import Admin from "@/models/admin";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import NodeMailjet from "node-mailjet";

// Initialize Mailjet Client with your 4 specific env configurations
const mailjet = new NodeMailjet({
  apiKey: process.env.MJ_APIKEY_PUBLIC || "",
  apiSecret: process.env.MJ_APIKEY_PRIVATE || ""
});

// --- GLOBAL IN-MEMORY IP TRACKER (RAM) ---
interface IRateLimit {
  count: number;
  blockCount: number;
  lockUntil: number;
}
const globalRateLimitStore = new Map<string, IRateLimit>();

// =========================================================================
// STEP 1: INITIAL PASSWORD CHECK & SEND MAGIC LINK (WITH RESCUE FLOW)
// =========================================================================
export const adminLogin = async (req: Request) => {
  try {
    const currentTime = Date.now();

    // ─── DYNAMIC MULTI-PLATFORM IP EXTRACTOR ─────────────────────────────────
    const ip = 
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() || 
      req.headers.get("x-real-ip") ||                             
      req.headers.get("cf-connecting-ip") ||                     
      "127.0.0.1";                                                

    // 1. Check Global IP Lock
    const ipTrack = globalRateLimitStore.get(ip);
    if (ipTrack && ipTrack.lockUntil > currentTime) {
      const remainingTime = ipTrack.lockUntil - currentTime;
      const timeString = remainingTime > 60 * 60 * 1000 
        ? `${Math.ceil(remainingTime / 3600000)} hours`
        : `${Math.ceil(remainingTime / 60000)} minutes`;

      return NextResponse.json(
        { error: `Too many login attempts. Blocked globally. Try again in ${timeString}.` },
        { status: 429 }
      );
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 2. Find Admin profile
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });

    // --- Failure Handler for Fake Emails or Wrong Passwords (< 4 tries) ---
    const handleFailure = async (isAdminFound: boolean) => {
      const currentTrack = globalRateLimitStore.get(ip) || { count: 0, blockCount: 0, lockUntil: 0 };
      currentTrack.count += 1;

      if (currentTrack.blockCount >= 1 && currentTrack.count > 0) {
        currentTrack.lockUntil = Date.now() + 24 * 60 * 60 * 1000;
        currentTrack.blockCount += 1;
        currentTrack.count = 0;
      } else if (currentTrack.count >= 5) {
        currentTrack.lockUntil = Date.now() + 10 * 60 * 1000;
        currentTrack.blockCount += 1;
        currentTrack.count = 0;
      }
      globalRateLimitStore.set(ip, currentTrack);

      if (isAdminFound && admin) {
        admin.loginAttempts += 1;
        await admin.save();
      }

      return NextResponse.json({ error: "Invalid Credentials" }, { status: 401 });
    };

    if (!admin) return handleFailure(false);

    // 3. Check Account Lock Status in MongoDB
    if (admin.lockUntil && new Date() < admin.lockUntil) {
      return NextResponse.json({ error: "Account locked temporarily. Try again later." }, { status: 423 });
    }

    // 4. Verify Password Complexity Match
    const isMatch = await bcrypt.compare(password, admin.password);

    // --- CUSTOM FORGOT PASSWORD RESCUE (Triggers on 4th or 5th try) ---
    if (!isMatch) {
      if (admin.loginAttempts >= 4) {
        const magicToken = crypto.randomBytes(32).toString("hex");
        
        admin.otp = magicToken; 
        admin.otptimeout = new Date(Date.now() + 11 * 60 * 1000); 
        admin.lockUntil = new Date(Date.now() + 10 * 60 * 1000); 
        await admin.save();

        const baseUrl = process.env.EMAIL_URL || "http://localhost:3000";
        const rescueLinkUrl = `${baseUrl}/api/auth/verify-link?token=${magicToken}&email=${encodeURIComponent(admin.email)}`;

        // Transactional Email Delivery via Mailjet
        try {
          await mailjet.post("send", { version: "v3.1" }).request({
            Messages: [
              {
                From: {
                  Email: process.env.MAIL_FROM_EMAIL || "no-reply@fitgymos.com",
                  Name: process.env.MAIL_FROM_NAME || "Shagun Ratna"
                },
                To: [
                  {
                    Email: admin.email,
                    Name: "Administrator"
                  }
                ],
                Subject: "🔒 Critical Security Alert: Administrative Recovery Link",
                TextPart: `Too many failed login attempts recorded. Access your portal using this link (valid for 10 minutes): ${rescueLinkUrl}`,
                HTMLPart: `
                  <div style="font-family: sans-serif; padding: 20px; max-width: 500px; border: 1px solid #2A0005; border-radius: 12px; background-color: #FCF8F2;">
                    <h2 style="color: #5C0612;">Security Recovery Notification</h2>
                    <p style="color: #333;">Multiple failed access attempts were detected on your dashboard profile. Your password flow has been frozen for safety precautions.</p>
                    <p style="color: #333;">Click the button below to authenticate directly via secure token verification:</p>
                    <div style="margin: 30px 0; text-align: center;">
                      <a href="${rescueLinkUrl}" style="background-color: #5C0612; color: #FFFFFF; padding: 14px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; uppercase; letter-spacing: 0.1em; display: inline-block;">Verify Profile Access</a>
                    </div>
                    <p style="font-size: 0.8rem; color: #640a17;">This secure link expires automatically in 10 minutes.</p>
                  </div>
                `
              }
            ]
          });
          console.log(`[MAILJET SUCCESS] Rescue link dispatched to: ${admin.email}`);
        } catch (mailError) {
          console.error("[MAILJET ERROR] System fallback engaged:");
          console.log(`\n🔑 [LOCAL DEV RECOVERY] LINK:\n${rescueLinkUrl}\n`);
        }

        return NextResponse.json({ 
          message: "Too many failed attempts. A magic recovery link has been sent to your email.",
          action: "TRIGGER_UI_TIMER",
          timerDurationMs: 10 * 60 * 1000 
        }, { status: 200 });
      }
      return handleFailure(true);
    }

    // ==========================================
    // HIGHWAY PATH: EMAIL & PASSWORD ARE 100% OK
    // ==========================================
    globalRateLimitStore.delete(ip); 
    
    const magicToken = crypto.randomBytes(32).toString("hex");

    admin.otp = magicToken;
    admin.otptimeout = new Date(Date.now() + 11 * 60 * 1000); 
    admin.loginAttempts = 0; 
    admin.lockUntil = null;
    await admin.save();

    const baseUrl = process.env.PORT || "https://shagunratna.onrender.com/";
    const standardLinkUrl = `${baseUrl}/api/auth/verify-link?token=${magicToken}&email=${encodeURIComponent(admin.email)}`;

    // Transactional Email Delivery via Mailjet
    try {
      await mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: {
              Email: process.env.MAIL_FROM_EMAIL || "no-reply@fitgymos.com",
              Name: process.env.MAIL_FROM_NAME || "Shagun Ratna"
            },
            To: [
              {
                Email: admin.email,
                Name: "Administrator"
              }
            ],
            Subject: "🔑 Secure Portal Gateway: Confirm Login Request",
            TextPart: `Click the following link to authorize dashboard synchronization: ${standardLinkUrl}`,
            HTMLPart: `
              <div style="font-family: sans-serif; padding: 20px; max-width: 500px; border: 1px solid #2A0005; border-radius: 12px; background-color: #FCF8F2;">
                <h2 style="color: #5C0612;">Dashboard Verification Requested</h2>
                <p style="color: #333;">Your primary credentials have been successfully authenticated.</p>
                <p style="color: #333;">Please click the button below to confirm your session identity and launch into management tools:</p>
                <div style="margin: 30px 0; text-align: center;">
                  <a href="${standardLinkUrl}" style="background-color: #5C0612; color: #FFFFFF; padding: 14px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; uppercase; letter-spacing: 0.1em; display: inline-block;">Confirm Login Session</a>
                </div>
                <p style="font-size: 0.8rem; color: #640a17;">This one-time access token expires in 10 minutes.</p>
              </div>
            `
          }
        ]
      });
      console.log(`[MAILJET SUCCESS] Standard access link dispatched to: ${admin.email}`);
    } catch (mailError) {
      console.error("[MAILJET ERROR] System fallback engaged:");
      console.log(`\n🔑 [LOCAL DEV STANDARD PATH] LINK:\n${standardLinkUrl}\n`);
    }

    return NextResponse.json({ 
      message: "Credentials approved. Confirmation link sent to your registered email.",
      action: "TRIGGER_UI_TIMER",
      timerDurationMs: 10 * 60 * 1000 
    }, { status: 200 });

  } catch (error) {
    console.error("Admin Login Step 1 Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

// =========================================================================
// STEP 2: VERIFY MAGIC LINK CLICK & GRANT ACCESS TOKENS
// =========================================================================
export const verifyOTP = async (req: Request) => {
  try {
    const { email, token } = await req.json();

    if (!email || !token) {
      return NextResponse.json({ error: "Missing required validation parameters" }, { status: 400 });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return NextResponse.json({ error: "Access Denied" }, { status: 404 });
    }

    if (!admin.otp || !admin.otptimeout || new Date() > admin.otptimeout) {
      return NextResponse.json({ error: "Magic link has expired. Please request a new one." }, { status: 400 });
    }

    if (admin.otp !== token) {
      return NextResponse.json({ error: "Invalid or corrupted security token link." }, { status: 401 });
    }

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
    console.error("Admin Link Verification Step 2 Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

// =========================================================================
// STEP 3: TERMINATE SESSION (LOGOUT)
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