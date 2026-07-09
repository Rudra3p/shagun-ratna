import { NextResponse } from "next/server";
import dbConnect from "@/db/db";
import User from "@/models/user";
import jwt from "jsonwebtoken";

// PUBLIC ROUTE, PRIVATE DATA: reachable by anyone, but only returns data
// when the request carries a valid shagun_user_access cookie.
export async function GET(req: Request) {
  try {
    await dbConnect();

    const cookieHeader = req.headers.get("cookie") || "";
    const accessToken = cookieHeader
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("shagun_user_access="))
      ?.split("=")[1];

    if (!accessToken) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    let decoded: { id: string };
    try {
      decoded = jwt.verify(accessToken, process.env.JWT_SECRET!) as { id: string };
    } catch {
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    const user = await User.findById(decoded.id).select("name email phone birthdate gender createdAt");
    if (!user) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Profile fetch failed:", error);
    return NextResponse.json({ error: "Unable to load profile" }, { status: 500 });
  }
}
