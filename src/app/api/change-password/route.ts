import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Host } from "@/components/Global-exports/global-exports";

export async function POST(req: NextRequest) {
  try {
    const { newPassword } = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required. Please sign in." },
        { status: 401 }
      );
    }

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Call backend API to change password
    const res = await axios.post(
      `${Host}/change-password`,
      { newPassword },
      {
        timeout: 25000,
        headers: {
          'Content-Type': 'application/json',
          'token': token
        }
      }
    );

    if (res.data?.success) {
      return NextResponse.json({
        success: true,
        message: res.data.message || "Password changed successfully"
      });
    }

    return NextResponse.json(
      { success: false, message: res.data?.message || "Failed to change password" },
      { status: 400 }
    );

  } catch (error: any) {
    console.error("Change password error:", error);

    let errorMessage = "Failed to change password. Please try again.";
    let statusCode = 500;

    if (error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND') {
      errorMessage = "Unable to connect to the backend server. Please check your internet connection and try again.";
      statusCode = 503;
    } else if (error?.response?.status === 502) {
      errorMessage = "Backend server is not responding. The server may be down or overloaded. Please try again in a few moments.";
      statusCode = 502;
    } else if (error?.response?.status === 504) {
      errorMessage = "Request timeout. The backend server took too long to respond. Please try again.";
      statusCode = 504;
    } else if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
      errorMessage = "The request took too long (over 25 seconds). The backend server may be slow or unresponsive. Please try again.";
      statusCode = 504;
    } else if (error?.response?.status === 401) {
      errorMessage = "Your session has expired. Please sign in again.";
      statusCode = 401;
    } else if (error?.response?.status === 400) {
      errorMessage = error?.response?.data?.message || "Invalid password. Please check and try again.";
      statusCode = 400;
    } else if (error?.response?.status === 500) {
      errorMessage = "Our servers are experiencing issues. Please try again in a few moments.";
      statusCode = 500;
    } else if (error?.response?.status === 503) {
      errorMessage = "The service is temporarily unavailable. We're working on fixing it.";
      statusCode = 503;
    } else if (error?.response?.data?.message) {
      errorMessage = error.response.data.message;
      statusCode = error?.response?.status || 400;
    }

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: statusCode }
    );
  }
}
