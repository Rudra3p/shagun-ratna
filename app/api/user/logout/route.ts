import { userLogout } from "@/controllers/userController";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    return await userLogout(request);
  } catch (error) {
    return NextResponse.json({ error: "Logout Error" }, { status: 500 });
  }
}