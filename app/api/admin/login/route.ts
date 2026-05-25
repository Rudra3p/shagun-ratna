import dbConnect from "@/db/db";
import { adminLogin, verifyOTP } from "@/controllers/adminController"; // 🔥 Import both from your controller
import { NextResponse } from "next/server";

// Handles: POST /api/admin/login
export async function POST(req: Request) {
  try {
    await dbConnect();
    
    // Clone the incoming request so we can read its JSON body data safely
    const clonedReq = req.clone();
    const bodyData = await clonedReq.json();

    // 🔒 STEP 2: If the frontend sends action: "VERIFY_OTP", process the token validation
    if (bodyData?.action === "VERIFY_OTP") {
      return await verifyOTP(req);
    }

    // 🔑 STEP 1: Default to the normal password and email check
    return await adminLogin(req);

  } catch (error) {
    console.error("Authentication Route Failure:", error);
    return NextResponse.json(
      { error: "Failed to process authentication request" }, 
      { status: 500 }
    );
  }
}