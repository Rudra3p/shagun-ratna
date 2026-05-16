import User from "@/models/user"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// 1. REGISTER BUYER
export const registerUser = async (req: Request) => {
  try {
    // UPDATED: name and phone instead of businessName
    const { name, email, phone, password } = await req.json();

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
      password: hashedPassword,
    });

    await newUser.save();
    return NextResponse.json({ message: "Account created successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
};

// 2. LOGIN BUYER
export const userLogin = async (req: Request) => {
  try {
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // --- ACCESS TOKEN (Short lived - 15 mins) ---
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" }
    );

    // --- REFRESH TOKEN (Long lived - 7 days) ---
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: "7d" }
    );

    // CRITICAL: Save Refresh Token to User Model in DB
    user.refreshToken = refreshToken;
    await user.save();

    const response = NextResponse.json({ message: "Welcome to Shagun Ratna" }, { status: 200 });

    // SET ACCESS COOKIE
    response.cookies.set("shagun_user_access", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60, // 15 mins
    });

    // SET REFRESH COOKIE
    response.cookies.set("shagun_user_refresh", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
};

// 3. LOGOUT BUYER
export const userLogout = async (req: Request) => {
  try {
    // Ideally, pass the user ID to clear the DB token
    // For now, we clear the cookies
    const response = NextResponse.json({ message: "Logged out" }, { status: 200 });

    response.cookies.set("shagun_user_access", "", { maxAge: 0, path: "/" });
    response.cookies.set("shagun_user_refresh", "", { maxAge: 0, path: "/" });

    return response;
  } catch (error) {
     return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
};