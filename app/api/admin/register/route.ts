import dbConnect from "@/db/db";
import { registerAdmin } from "@/controllers/adminController";

export async function POST(req: Request) {
  try {
    // 1. Establish connection to your MongoDB
    await dbConnect();

    // 2. Hand off to the controller for hashing and saving
    return await registerAdmin(req);
    
  } catch (error) {
    console.error("Admin Registration Route Error:", error);
    return new Response(
      JSON.stringify({ error: "Could not create admin account" }), 
      { status: 500 }
    );
  }
}