import { getRecommendations } from "@/controllers/recommendationController";

export async function GET(req: Request) {
  return await getRecommendations(req);
}
