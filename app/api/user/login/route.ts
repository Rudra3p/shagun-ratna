import dbConnect from "@/db/db";
import { userLogin } from "@/controllers/userController";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await dbConnect();
    return await userLogin(req);
  } catch (error) {
    return NextResponse.json({ error: "Connection Error" }, { status: 500 });
  }
}