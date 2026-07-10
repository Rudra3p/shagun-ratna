import { NextResponse } from "next/server";
import dbConnect from "@/db/db";
import Inquiry from "@/models/Inquiry";

export const addInquiry = async (req: Request): Promise<NextResponse> => {
  try {
    await dbConnect();

    const body = await req.json();

    const newInquiry = new Inquiry({
      name: body.name,
      phone: body.phone,
      productName: body.productName,
      customizationNotes: body.customizationNotes,
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
