import { NextResponse } from "next/server";
import { userSignout } from "@/controllers/userController";

export async function POST(): Promise<NextResponse> {
  try {
    // 🧠 Calls updated controller method to clear the secure HTTP-Only cookies
    return await userSignout();
  } catch (error) {
    console.error("Critical Signout Pipeline Failure:", error);
    return NextResponse.json(
      { error: "Internal Authentication Pipeline Error" }, 
      { status: 500 }
    );
  }
}