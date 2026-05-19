import { adminLogout } from "@/controllers/adminController";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // No DB connection needed just to clear cookie strings, making it fast
    return await adminLogout(req);
  } catch (error) {
    console.error("Admin Logout Route Error:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}