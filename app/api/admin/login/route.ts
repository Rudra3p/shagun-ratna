import dbConnect from "@/db/db";
import { adminLogin } from "@/controllers/adminController"; 
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. Ensure DB connection
    await dbConnect();
    
    // 2. Delegate the login logic to your adminLogin controller
    // This controller handles credential checking and email dispatch
    return await adminLogin(req);

  } catch (error) {
    console.error("Login Route Failure:", error);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}