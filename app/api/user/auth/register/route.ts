import { NextResponse } from "next/server";
import dbConnect from "@/db/db";
import { registerUser } from "@/controllers/userController";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // 1. Establish secure database connectivity
    await dbConnect();
    
    // 2. Delegate incoming payload flow execution to the controller
    return await registerUser(request);
  } catch (error) {
    console.error("Critical Registration Pipeline Failure:", error);
    return NextResponse.json(
      { error: "Internal Authentication Pipeline Error" }, 
      { status: 500 }
    );
  }
}