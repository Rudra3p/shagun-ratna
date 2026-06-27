import { NextResponse } from "next/server";
import { getAdminProfile, updateAdminProfile } from "@/controllers/adminController";
import dbConnect from "@/db/db"; // 👈 Import your exact connection script here

// FETCH PROFILE DATA
export async function GET(req: Request) {
  try {
    // 1. Force the database pool to wake up first!
    await dbConnect(); 
    
    // 2. Now it is safe to run the controller logic
    return await getAdminProfile(req);
  } catch (error: any) {
    console.error("Route Crash Log:", error);
    return NextResponse.json({ error: "Internal Database Connection Error" }, { status: 500 });
  }
}

// UPDATE PROFILE DATA
export async function PUT(req: Request) {
  try {
    // 1. Force the database pool to wake up first!
    await dbConnect(); 

    // 2. Execute profile updating logic
    return await updateAdminProfile(req);
  } catch (error: any) {
    console.error("Route Crash Log:", error);
    return NextResponse.json({ error: "Internal Database Connection Error" }, { status: 500 });
  }
}