import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { Host } from "../../../../Components/Global-exports/global-exports";


export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    // Validation
    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Call backend API
    const res = await axios.post(`${Host}/otpverify`, { email, otp });

    if (!res.data?.success) {
      return NextResponse.json(
        { success: false, message: res.data?.message || "Verification failed" },
        { status: 400 }
      );
    }

    // Get the token from backend response cookie if sent
    const backendToken = res.headers['set-cookie']?.find(cookie => 
      cookie.startsWith('token=')
    );

    // Create response
    const response = NextResponse.json({ 
      success: true,
      message: res.data?.message || "Email verified successfully" 
    });

    // If backend sent a token in cookie, forward it to client
    if (backendToken) {
      response.cookies.set({
        name: 'token',
        value: backendToken.split('token=')[1].split(';')[0],
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      });
    }

    return response;

  } catch (error: any) {
    console.error("OTP verification error:", error.response?.data || error.message);

    // Handle specific error cases
    let errorMessage = "OTP verification failed";
    let statusCode = 500;

    if (error.response) {
      errorMessage = error.response.data?.message || errorMessage;
      statusCode = error.response.status;
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = "Cannot connect to server";
      statusCode = 503;
    }

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: statusCode }
    );
  }
}