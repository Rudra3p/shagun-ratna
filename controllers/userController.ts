import { NextResponse } from "next/server";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRegisterSchema, UserLoginSchema } from "@/schemas/authUserSchemas";

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Core helper to extract the user ID safely from the refresh token cookie string value
export const getUserIdFromRefreshToken = (req: Request): string | null => {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const refreshToken = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("shagun_user_refresh="))
      ?.split("=")[1];

    if (!refreshToken) return null;

    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
      console.error("❌ Configuration Error: process.env.JWT_REFRESH_SECRET is missing.");
      return null;
    }

    const decoded = jwt.verify(refreshToken, secret) as { id: string };
    return decoded.id;
  } catch (error) {
    console.error("🔐 User Session Token Error:", error);
    return null; 
  }
};

// ==========================================
// USER AUTHENTICATION CONTROLLERS
// ==========================================

// 1. REGISTER USER
export const registerUser = async (req: Request): Promise<NextResponse> => {
  try {
    const body = await req.json();

    // Zod Validation (The Gatekeeper)
    const validation = UserRegisterSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
    }

    const { name, email, phone, password, birthdate, gender } = validation.data;

    // Check if account rules conflict with database unique items
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return NextResponse.json({ error: "Email or Phone already in use" }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      phone,
      birthdate,
      gender,
      password: hashedPassword,
      loginAttempts: 0 // Match admin-side security schema structure
    });

    const accessToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET!, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: newUser._id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
    newUser.refreshToken = refreshToken;

    await newUser.save();

    // Registering also signs the user in immediately, same as the signin flow
    const response = NextResponse.json({
      message: "Account created successfully",
      user: {
        name: newUser.name,
        birthdate: newUser.birthdate,
        gender: newUser.gender
      }
    }, { status: 201 });

    response.cookies.set("shagun_user_access", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 900
    });

    response.cookies.set("shagun_user_refresh", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 604800
    });

    return response;
  } catch (error) {
    console.error("User Registration Error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
};

// 2. SIGNIN USER
export const userSignin = async (req: Request): Promise<NextResponse> => {
  try {
    const body = await req.json();

    // Zod Validation 
    const validation = UserLoginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
    }

    const { email, password } = validation.data;
    const user = await User.findOne({ email });

    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // Track login attempts to match admin tracking layout safely
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      await user.save();
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // SUCCESS: Reset security counters completely
    user.loginAttempts = 0;
    
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });

    user.refreshToken = refreshToken;
    await user.save();

    // Bundled client tracking metadata payload for the frontend state requirements
    const response = NextResponse.json({ 
      message: "Welcome to Shagun Ratna",
      user: {
        name: user.name,
        birthdate: user.birthdate,
        gender: user.gender
      }
    }, { status: 200 });

    // Set HTTP-Only access cookies matching your exact admin layout
    response.cookies.set("shagun_user_access", accessToken, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", 
      sameSite: "lax", 
      path: "/", 
      maxAge: 900 
    });
    
    response.cookies.set("shagun_user_refresh", refreshToken, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", 
      sameSite: "lax", 
      path: "/", 
      maxAge: 604800 
    });

    return response;
  } catch (error) {
    console.error("User Signin Error:", error);
    return NextResponse.json({ error: "Signin failed" }, { status: 500 });
  }
};

// 3. LOGOUT USER
export const userSignout = async (): Promise<NextResponse> => {
  const response = NextResponse.json({ message: "Logged out successfully" }, { status: 200 });

  // Wipe cookie context paths clean immediately
  response.cookies.set("shagun_user_access", "", { maxAge: 0, path: "/" });
  response.cookies.set("shagun_user_refresh", "", { maxAge: 0, path: "/" });

  return response;
};

// 4. REFRESH ACCESS TOKEN (mirrors the admin-side /api/admin/refresh flow)
export const userRefresh = async (req: Request): Promise<NextResponse> => {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const refreshToken = cookieHeader
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("shagun_user_refresh="))
      ?.split("=")[1];

    if (!refreshToken) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { id: string };

    // DB CHECK: the cookie's token must match the one on record, so a signed-out
    // or revoked refresh token can't silently mint fresh access tokens forever.
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "15m" });

    const response = NextResponse.json({ success: true });

    response.cookies.set("shagun_user_access", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 900,
    });

    return response;
  } catch (error) {
    console.error("User Refresh Error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
  }
};