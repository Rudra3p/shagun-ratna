import dbConnect from "@/db/db";
import { getReviews, deleteReview, syncFeaturedReviews } from "@/controllers/reviewsController";

const ensureDB = async () => await dbConnect();

export async function GET(req: Request) {
  await ensureDB();
  return await getReviews(req);
}

export async function PUT(req: Request) {
  await ensureDB();
  return await syncFeaturedReviews(req);
}

export async function DELETE(req: Request) {
  await ensureDB();
  return await deleteReview(req);
}
