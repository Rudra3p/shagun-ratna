import { adminLogout } from "@/controllers/adminController";
import { NextResponse } from "next/server";

// Handles: POST /api/admin/logout
export async function POST(req: Request) {
  try {
    // Passes the request down to your controller to clear cookie headers
    return await adminLogout(req);
  } catch (error) {
    console.error("Admin Logout Backend Route Error:", error);
    return NextResponse.json(
      { error: "Failed to execute server-side logout process" }, 
      { status: 500 }
    );
  }
}