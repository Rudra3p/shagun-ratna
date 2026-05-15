import { adminLogout } from "@/controllers/adminController";

export async function POST(request: Request) {
  // Logout doesn't need dbConnect because we are just clearing cookies
  return await adminLogout(request);
}