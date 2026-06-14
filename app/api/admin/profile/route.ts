import { 
  getAdminProfile, 
  updateName, 
  updatePassword 
} from "@/controllers/adminProfileController";

// GET: Fetch the current admin's profile
export async function GET(req: Request) {
  return await getAdminProfile(req);
}

// PUT: Update the admin's name
export async function PUT(req: Request) {
  return await updateName(req);
}

// PATCH: Update the admin's password
export async function PATCH(req: Request) {
  return await updatePassword(req);
}