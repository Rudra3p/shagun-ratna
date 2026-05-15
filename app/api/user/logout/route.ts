import { userLogout } from "@/controllers/userController";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    return await userLogout();
  } catch (error) {
    return NextResponse.json({ error: "Logout Error" }, { status: 500 });
  }
}