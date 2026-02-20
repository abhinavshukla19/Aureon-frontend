import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Host } from "@/components/Global-exports/global-exports";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  // using rezex to check  if email or phonenumber
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
  const isPhone = /^[0-9]{10}$/.test(username);

  if (!isEmail && !isPhone) {
    return NextResponse.json(
      { success: false, message: "Invalid email or phone number" },
      { status: 400 }
    );
  }
  console.log({
      email: isEmail ? username : null,
      phone_number: isPhone ? username : null,
      password
    })
  
  try {
    const res = await axios.post(`${Host}/signin`, {
      email: isEmail ? username : null,
      phone_number: isPhone ? username : null,
      password
    }, {
      timeout: 25000, // 25 seconds timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (res.status === 200) {
      (await cookies()).set({
        name: "token",
        value: res.data.token,
        httpOnly: true,
        secure: false,
        sameSite: "lax", // Changed from "none"
        path: "/",
        maxAge: 60 * 60 * 24 * 7, 
      });
      
      // RETURN SUCCESS HERE!
      return NextResponse.json({
        success: true,
        message: "Login successful"
      }, {
        status: 200 // Changed to 200
      });
    }
    
    return NextResponse.json({
      success: false,
      message: res.data.message
    }, {
      status: 400
    });
    
  } catch (err: any) {
    console.error("Signin error:", err);
    
    let errorMessage = "Something went wrong";
    let statusCode = 500;
    
    if (err?.code === 'ECONNREFUSED' || err?.code === 'ENOTFOUND') {
      errorMessage = "Unable to connect to the backend server. Please check your internet connection and try again.";
      statusCode = 503;
    } else if (err?.response?.status === 502) {
      errorMessage = "Backend server is not responding. The server may be down or overloaded. Please try again in a few moments.";
      statusCode = 502;
    } else if (err?.response?.status === 504) {
      errorMessage = "Request timeout. The backend server took too long to respond. Please try again.";
      statusCode = 504;
    } else if (err?.code === 'ECONNABORTED' || err?.message?.includes('timeout')) {
      errorMessage = "The request took too long (over 25 seconds). The backend server may be slow or unresponsive. Please try again.";
      statusCode = 504;
    } else if (err?.response?.status === 500) {
      errorMessage = "Our servers are experiencing issues. Please try again in a few moments.";
      statusCode = 500;
    } else if (err?.response?.status === 503) {
      errorMessage = "The service is temporarily unavailable. We're working on fixing it.";
      statusCode = 503;
    } else if (err?.response?.data?.message) {
      errorMessage = err.response.data.message;
      statusCode = err?.response?.status || 400;
    } else if (err?.response?.status === 401) {
      errorMessage = "Invalid email/phone number or password. Please check your credentials and try again.";
      statusCode = 401;
    } else if (err?.response?.status === 404) {
      errorMessage = "Account not found. Please check your email/phone number or sign up for a new account.";
      statusCode = 404;
    }
    
    return NextResponse.json({
      success: false,
      message: errorMessage
    }, {
      status: statusCode
    });
  }
}