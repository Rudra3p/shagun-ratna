import dbConnect from "@/db/db";
import { adminLogin } from "@/controllers/adminController";

// This handles POST /api/admin/login
export async function POST(req: Request) {
  try {
    // 1. Establish connection to MongoDB
    await dbConnect();
    
    // 2. Pass request to controller for validation and cookie setting
    return await adminLogin(req);
    
  } catch (error) {
    console.error("Route Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process login" }), 
      { status: 500 }
    );
  }
}