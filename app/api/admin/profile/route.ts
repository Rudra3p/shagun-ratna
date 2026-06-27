import { NextRequest, NextResponse } from "next/server";
import { getAdminProfile, updateAdminProfile } from "@/controllers/adminController";

export async function GET(req: NextRequest) {
  try {
    return await getAdminProfile(req);
  } catch (error: any) {
    console.error("GET Profile Route Error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    return await updateAdminProfile(req);
  } catch (error: any) {
    console.error("PUT Profile Route Error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}