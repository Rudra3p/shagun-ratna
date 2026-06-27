import { NextResponse } from "next/server";
import { getAdminProfile, updateAdminProfile } from "@/controllers/adminController";

// 1. GET current admin profile data
export async function GET(req: Request) {
  try {
    return await getAdminProfile(req);
  } catch (error) {
    console.error("GET Profile Route Error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

// 2. PUT updated admin profile data
export async function PUT(req: Request) {
  try {
    return await updateAdminProfile(req);
  } catch (error) {
    console.error("PUT Profile Route Error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}