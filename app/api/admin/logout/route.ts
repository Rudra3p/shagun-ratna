// app/api/admin/logout/route.ts
import { adminLogout } from "@/controllers/adminController";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Call it without the 'req' argument
    return await adminLogout();
  } catch (error) {
    console.error("Admin Logout Backend Route Error:", error);
    return NextResponse.json({ error: "Logout Failed" }, { status: 500 });
  }
}