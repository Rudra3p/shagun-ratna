import dbConnect from "@/db/db";
import { adminLogin } from "@/controllers/adminController";
import { NextResponse } from "next/server";

// This handles ONLY: POST /api/auth/login
export async function POST(req: Request) {
  try {
    // 1. Establish connection to MongoDB
    await dbConnect();
    
    // 2. Pass the request directly to the login execution controller
    return await adminLogin(req);
    
  } catch (error) {
    console.error("Authentication Route Failure:", error);
    return NextResponse.json(
      { error: "Failed to process login request" }, 
      { status: 500 }
    );
  }
}