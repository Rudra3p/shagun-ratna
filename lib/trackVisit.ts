import dbConnect from "@/db/db";
import VisitLog from "@/models/VisitLog";

export async function trackVisit(dateKey: string): Promise<void> {
  try {
    await dbConnect();
    await VisitLog.findOneAndUpdate(
      { date: dateKey },
      { $inc: { count: 1 } },
      { upsert: true }
    );
  } catch (error) {
    console.error("Visit tracking failed:", error);
  }
}
