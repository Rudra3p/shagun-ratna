import Admin from "@/models/admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const adminLogin = async (req: Request) => {
  try {
    // 1. Destructure email instead of username
    const { email, password } = await req.json();

    // 2. Search by email (Case-insensitive search is safer)
    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    
    if (!admin) {
      return NextResponse.json({ error: "Access Denied" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid Credentials" }, { status: 401 });
    }

    // --- ACCESS TOKEN (15 mins) ---
    const accessToken = jwt.sign(
      { id: admin._id }, 
      process.env.JWT_SECRET as string, 
      { expiresIn: "15m" }
    );

    // --- REFRESH TOKEN (7 days) ---
    const refreshToken = jwt.sign(
      { id: admin._id }, 
      process.env.JWT_REFRESH_SECRET as string, 
      { expiresIn: "7d" }
    );

    // --- SAVE REFRESH TOKEN TO DB ---
    admin.refreshToken = refreshToken;
    await admin.save();

    const response = NextResponse.json(
      { message: "Welcome back, Boss. Legend Mode Active." }, 
      { status: 200 }
    );

    // Set Access Cookie
    response.cookies.set("shagun_admin_access", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    // Set Refresh Cookie
    response.cookies.set("shagun_admin_refresh", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Admin Login Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export const adminLogout = async (req: Request) => {
  try {
    const response = NextResponse.json({ message: "Admin logged out successfully" }, { status: 200 });
    
    // Clear the cookies
    response.cookies.set("shagun_admin_access", "", { maxAge: 0, path: "/" });
    response.cookies.set("shagun_admin_refresh", "", { maxAge: 0, path: "/" });
    
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
};