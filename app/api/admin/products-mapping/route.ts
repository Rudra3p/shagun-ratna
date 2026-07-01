import { NextResponse } from "next/server";
import { 
  getSmartCollection, 
  configureShowcase, 
  updateSmartCollection 
} from "@/controllers/showcaseController";

// GET /api/admin/products-mapping
export async function GET(request: Request): Promise<NextResponse> {
  return getSmartCollection(request);
}

// POST /api/admin/products-mapping
export async function POST(request: Request): Promise<NextResponse> {
  return configureShowcase(request);
}

// PUT /api/admin/products-mapping
export async function PUT(request: Request): Promise<NextResponse> {
  return updateSmartCollection(request);
}