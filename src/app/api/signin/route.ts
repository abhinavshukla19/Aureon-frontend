import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Host } from "../../../../Components/Global-exports/global-exports";

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
    });
    
    console.log(req.body)
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
    
    if (err?.code === 'ECONNREFUSED' || err?.code === 'ENOTFOUND') {
      errorMessage = "Unable to connect to the server. Please check your internet connection and try again.";
    } else if (err?.response?.status === 500) {
      errorMessage = "Our servers are experiencing issues. Please try again in a few moments.";
    } else if (err?.response?.status === 503) {
      errorMessage = "The service is temporarily unavailable. We're working on fixing it.";
    } else if (err?.message?.includes('timeout')) {
      errorMessage = "The request took too long. Please check your connection and try again.";
    } else if (err?.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err?.response?.status === 401) {
      errorMessage = "Invalid email/phone number or password. Please check your credentials and try again.";
    } else if (err?.response?.status === 404) {
      errorMessage = "Account not found. Please check your email/phone number or sign up for a new account.";
    }
    
    return NextResponse.json({
      success: false,
      message: errorMessage
    }, {
      status: err?.response?.status || 500
    });
  }
}