import { NextResponse } from "next/server";
import dbConnect from "@/db/db";
import Inquiry from "@/models/Inquiry";

const ONE_HOUR_MS = 60 * 60 * 1000;
const MAX_INQUIRIES_PER_IP_PER_HOUR = 5;

const getClientIp = (req: Request): string => {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
};

export const addInquiry = async (req: Request): Promise<NextResponse> => {
  try {
    await dbConnect();

    const body = await req.json();

    // Honeypot: a hidden field real visitors never see or fill, that bots tend to
    // auto-fill anyway. Pretend success so scripted submitters don't learn they
    // were caught, without ever writing their spam to the database.
    if (body.companyWebsite) {
      return NextResponse.json(
        { success: true, message: "Inquiry submitted successfully" },
        { status: 201 }
      );
    }

    const ip = getClientIp(req);

    const recentCount = await Inquiry.countDocuments({
      ip,
      createdAt: { $gte: new Date(Date.now() - ONE_HOUR_MS) },
    });

    if (recentCount >= MAX_INQUIRIES_PER_IP_PER_HOUR) {
      return NextResponse.json(
        { success: false, error: "Too many inquiries submitted. Please try again in a bit." },
        { status: 429 }
      );
    }

    const newInquiry = new Inquiry({
      name: body.name,
      phone: body.phone,
      productName: body.productName,
      customizationNotes: body.customizationNotes,
      ip,
    });

    const savedInquiry = await newInquiry.save();

    return NextResponse.json(
      { success: true, message: "Inquiry submitted successfully", inquiry: savedInquiry },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to submit inquiry";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
};

export const getInquiries = async (req: Request): Promise<NextResponse> => {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    // Defaults to "pending" so the admin inbox only shows inquiries still
    // awaiting review; pass status=all to see everything, including done ones.
    const status = url.searchParams.get("status") || "pending";

    const query = status === "all" ? {} : { status };
    const skip = (page - 1) * limit;

    const [inquiries, total] = await Promise.all([
      Inquiry.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Inquiry.countDocuments(query),
    ]);

    return NextResponse.json(
      {
        success: true,
        inquiries,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch inquiries" }, { status: 500 });
  }
};

export const markInquiryDone = async (req: Request): Promise<NextResponse> => {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID missing in URL" }, { status: 400 });
    }

    const updatedInquiry = await Inquiry.findByIdAndUpdate(id, { status: "done" }, { new: true });

    if (!updatedInquiry) {
      return NextResponse.json({ success: false, error: "Inquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Inquiry marked as done", inquiry: updatedInquiry }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update inquiry" }, { status: 500 });
  }
};

export const deleteInquiry = async (req: Request): Promise<NextResponse> => {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID missing in URL" }, { status: 400 });
    }

    const deletedInquiry = await Inquiry.findByIdAndDelete(id);

    if (!deletedInquiry) {
      return NextResponse.json({ success: false, error: "Inquiry not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Inquiry deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete inquiry" }, { status: 500 });
  }
};
