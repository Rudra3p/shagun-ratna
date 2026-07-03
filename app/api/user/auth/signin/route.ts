import { NextResponse } from "next/server";
import dbConnect from "@/db/db";
import { userSignin } from "@/controllers/userController";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // 1. Establish secure database connectivity
    await dbConnect();
    
    // 2. Delegate client credential payload validation to the controller
    return await userSignin(request);
  } catch (error) {
    console.error("Critical Signin Pipeline Failure:", error);
    return NextResponse.json(
      { error: "Internal Authentication Pipeline Error" }, 
      { status: 500 }
    );
  }
}