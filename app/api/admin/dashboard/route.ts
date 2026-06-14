import { getDashboardStats } from "@/controllers/adminDashController"; // Ensure your path is correct

export async function GET() {
  return await getDashboardStats();
}