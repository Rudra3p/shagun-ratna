import { NextResponse } from "next/server";
import dbConnect from "@/db/db";
import { userRefresh } from "@/controllers/userController";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    await dbConnect();
    return await userRefresh(request);
  } catch (error) {
    console.error("Critical Refresh Pipeline Failure:", error);
    return NextResponse.json(
      { error: "Internal Authentication Pipeline Error" },
      { status: 500 }
    );
  }
}
