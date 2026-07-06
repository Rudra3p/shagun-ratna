import dbConnect from "@/db/db";
import { addInquiry } from "@/controllers/inquiryController";

export async function POST(req: Request) {
  await dbConnect();
  return await addInquiry(req);
}
