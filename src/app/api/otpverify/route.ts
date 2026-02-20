import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { Host } from "@/components/Global-exports/global-exports";


export async function POST(req: NextRequest) {
  try {
    const { email, otp, purpose } = await req.json();

    // Validation
    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Validate purpose if provided
    const validPurposes = ['signup', 'password_change', 'email_change'];
    if (purpose && !validPurposes.includes(purpose)) {
      return NextResponse.json(
        { success: false, message: "Invalid verification purpose" },
        { status: 400 }
      );
    }

    // Call backend API with purpose
    const res = await axios.post(`${Host}/otpverify`, { 
      email, 
      otp,
      purpose: purpose || 'signup' // Default to signup for backward compatibility
    }, {
      timeout: 25000,
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (!res.data?.success) {
      return NextResponse.json(
        { success: false, message: res.data?.message || "Verification failed" },
        { status: res.status || 400 }
      );
    }

    // Get token from response body (backend should return it)
    let token: string | undefined = res.data?.token;

    // Fallback: Try to get token from response cookie headers if not in body
    if (!token) {
      const setCookieHeader = res.headers['set-cookie'];
      if (setCookieHeader) {
        const cookieArray = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
        const tokenCookie = cookieArray.find(cookie => cookie.startsWith('token='));
        
        if (tokenCookie) {
          token = tokenCookie.split('token=')[1].split(';')[0];
        }
      }
    }

    // Create response
    const response = NextResponse.json({ 
      success: true,
      message: res.data?.message || "OTP verified successfully",
      purpose: purpose || 'signup',
      // Include additional data from backend if needed (e.g., new email for email change)
      data: res.data?.data || {}
    });

    // Only set token cookie for signup verification
    // For password/email changes, user is already logged in
    if (token && (!purpose || purpose === 'signup')) {
      response.cookies.set({
        name: 'token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      });
    }

    return response;

  } catch (error: any) {
    console.error("OTP verification error:", error);

    let errorMessage = "OTP verification failed";
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
      errorMessage = error?.response?.data?.message || "Invalid OTP. Please check and try again.";
      statusCode = 401;
    } else if (error?.response?.status === 400) {
      errorMessage = error?.response?.data?.message || "OTP expired or invalid.";
      statusCode = 400;
    } else if (error?.response?.status === 429) {
      errorMessage = error?.response?.data?.message || "Too many attempts. Please request a new OTP.";
      statusCode = 429;
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