import { NextResponse } from "next/server";
import adminApi from "@/lib/adminApi";

export async function GET(request: Request) {
  try {
    // 1. Extract the query parameters from the link clicked by the user
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      return NextResponse.redirect(new URL("/admin/login?error=Invalid+Link", request.url));
    }

    // 2. Forward the verification request to your Backend server controller
    // This executes the 'verifyOTP' logic we updated earlier
    const backendResponse = await adminApi.post("/admin/verify", { email, token });

    if (backendResponse.status === 200) {
      // 3. Success! Redirect straight to your admin dashboard layout
      const dashboardUrl = new URL("/admin", request.url);
      const response = NextResponse.redirect(dashboardUrl);

      // 4. Pass along the HttpOnly authorization cookies dropped by your backend
      const setCookieHeader = backendResponse.headers["set-cookie"];
      if (setCookieHeader) {
        setCookieHeader.forEach((cookie) => {
          response.headers.append("Set-Cookie", cookie);
        });
      }

      return response;
    }

    // Fallback if backend rejected validation
    return NextResponse.redirect(new URL("/admin/login?error=Verification+Failed", request.url));

  } catch (error) {
    const err = error as {
      response?: { data?: { error?: string } };
      message?: string;
    };
    console.error("Link processing failure:", err.response?.data || err.message);
    const errMsg = err.response?.data?.error || "Link+Expired+or+Invalid";
    return NextResponse.redirect(new URL(`/admin/login?error=${encodeURIComponent(errMsg)}`, request.url));
  }
}