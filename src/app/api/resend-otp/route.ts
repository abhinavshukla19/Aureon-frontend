import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { Host } from "../../../../Components/Global-exports/global-exports";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // Validation
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Call backend API
    const res = await axios.post(`${Host}/resend-otp`, { email });

    // Backend returns success: true/false, not 200
    if (res.data.success) {
      return NextResponse.json(
        { 
          success: true, 
          message: res.data.message || "OTP sent successfully" 
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: res.data.message || "Failed to send OTP" 
      },
      { status: 400 }
    );

  } catch (error: any) {
    console.error("Resend OTP error:", error.response?.data || error.message);

    // Handle backend errors
    let errorMessage = "Failed to resend OTP. Please try again.";
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
