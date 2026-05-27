// app/api/admin/logout/route.ts
import { adminLogout } from "@/controllers/adminController";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Calling without arguments as per your current controller setup
    return await adminLogout();
  } catch (error) {
    console.error("Admin Logout Backend Route Error:", error);
    return NextResponse.json({ error: "Logout Failed" }, { status: 500 });
  }
}