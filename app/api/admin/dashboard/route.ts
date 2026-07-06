import { getDashboardStats } from "@/controllers/adminDashController";

export async function GET() {
  return await getDashboardStats();
}
