import dbConnect from "@/db/db";
import { verifyOTP } from "@/controllers/adminController"; // 🔥 Import your direct backend controller logic
import { NextResponse } from "next/server";

// Handles: POST /api/admin/verify
export async function POST(req: Request) {
  try {
    // 1. Connect straight to your MongoDB database instance
    await dbConnect();

    // 2. Clone and validate the incoming request parameters
    const clonedReq = req.clone();
    const { email, token } = await clonedReq.json();

    if (!token || !email) {
      return NextResponse.json(
        { error: "Missing email or verification code" }, 
        { status: 400 }
      );
    }

    // 3. Run the controller function directly (It checks DB, signs JWT, sets HttpOnly cookies)
    return await verifyOTP(req);

  } catch (error) {
    console.error("OTP Verification Backend Route Failure:", error);
    return NextResponse.json(
      { error: "Failed to execute server-side verification process" }, 
      { status: 500 }
    );
  }
}