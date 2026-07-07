import { getHistoryStats } from "@/controllers/adminHistoryController";

export async function GET(req: Request) {
  return await getHistoryStats(req);
}
