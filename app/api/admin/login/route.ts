import dbConnect from "@/db/db";
import { adminLogin } from "@/controllers/adminController";
import { NextResponse } from "next/server";

// Handles: POST /api/auth/login
export async function POST(req: Request) {
  try {
    await dbConnect();
    return await adminLogin(req);
  } catch (error) {
    console.error("Authentication Route Failure:", error);
    return NextResponse.json(
      { error: "Failed to process login request" }, 
      { status: 500 }
    );
  }
}