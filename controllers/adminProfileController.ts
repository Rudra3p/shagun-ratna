import { NextResponse } from "next/server";
import Admin from "@/models/admin";
import bcrypt from "bcryptjs";
import { UpdatePasswordSchema } from "@/schemas/authAdminSchemas";
import { z } from "zod";

// Schema for Name updates
const UpdateNameSchema = z.object({
  name: z.string().min(2, "Name is too short"),
});

export const getAdminProfile = async (req: Request) => {
  const adminId = req.headers.get("x-admin-id");
  if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = await Admin.findById(adminId).select("-password -refreshToken");
  if (!admin) return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  return NextResponse.json(admin, { status: 200 });
};

export const updateName = async (req: Request) => {
  try {
    const adminId = req.headers.get("x-admin-id");
    const body = await req.json();
    const validation = UpdateNameSchema.safeParse(body);
    
    if (!validation.success) return NextResponse.json({ error: "Invalid name" }, { status: 400 });

    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId, 
      { name: validation.data.name }, 
      { new: true, select: "-password -refreshToken" }
    );
    
    return NextResponse.json({ message: "Name updated", admin: updatedAdmin }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
};

export const updatePassword = async (req: Request) => {
  try {
    const adminId = req.headers.get("x-admin-id");
    const body = await req.json();
    const validation = UpdatePasswordSchema.safeParse(body);
    
    if (!validation.success) return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });

    const admin = await Admin.findById(adminId);
    if (!admin) return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    const isMatch = await bcrypt.compare(validation.data.currentPassword, admin.password);
    
    if (!isMatch) return NextResponse.json({ error: "Incorrect current password" }, { status: 401 });

    admin.password = await bcrypt.hash(validation.data.newPassword, 12);
    await admin.save();

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Password update failed" }, { status: 500 });
  }
};