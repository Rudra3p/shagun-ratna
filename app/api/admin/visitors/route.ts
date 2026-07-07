import { getVisitorStats } from "@/controllers/adminVisitorsController";

export async function GET() {
  return await getVisitorStats();
}
