import dbConnect from "@/db/db";
import { getInquiries, deleteInquiry } from "@/controllers/inquiryController";

const ensureDB = async () => await dbConnect();

export async function GET(req: Request) {
  await ensureDB();
  return await getInquiries(req);
}

export async function DELETE(req: Request) {
  await ensureDB();
  return await deleteInquiry(req);
}
