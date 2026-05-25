import { NextResponse } from "next/server";
import adminApi from "@/lib/adminApi";

// Changed from GET to POST because the frontend is submitting form data
export async function POST(request: Request) {
  try {
    // 1. Extract the JSON body payload submitted from your frontend OTP input form
    const { email, token } = await request.json();

    if (!token || !email) {
      return NextResponse.json({ error: "Missing email or verification code" }, { status: 400 });
    }

    // 2. Forward the verification payload to your backend controller
    // This executes the updated 'verifyOTP' logic we wrote earlier
    const backendResponse = await adminApi.post("/admin/verify", { 
      email, 
      token: token.trim().toUpperCase() // Automatically sanitize inputs to uppercase
    });

    if (backendResponse.status === 200) {
      // 3. Success! Prepare a standard JSON success response for your React/Next frontend
      const response = NextResponse.json(
        { message: "Verification successful. Redirecting..." },
        { status: 200 }
      );

      // 4. Pass along the HttpOnly authorization cookies dropped by your backend server
      const setCookieHeader = backendResponse.headers["set-cookie"];
      if (setCookieHeader) {
        setCookieHeader.forEach((cookie) => {
          response.headers.append("Set-Cookie", cookie);
        });
      }

      return response;
    }

    return NextResponse.json({ error: "Verification Failed" }, { status: 401 });

  } catch (error) {
    const err = error as {
      response?: { data?: { error?: string } };
      message?: string;
    };
    
    console.error("OTP processing failure:", err.response?.data || err.message);
    const errMsg = err.response?.data?.error || "Invalid or Expired OTP code.";
    
    return NextResponse.json({ error: errMsg }, { status: 401 });
  }
}