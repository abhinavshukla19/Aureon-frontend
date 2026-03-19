import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { Host } from "@/components/Global-exports/global-exports";
import { handleAxiosError } from "../ApiErrorHandler/errorHadler";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Email/phone and password are required" },
        { status: 400 }
      );
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
    const isPhone = /^[0-9]{10}$/.test(username);

    if (!isEmail && !isPhone) {
      return NextResponse.json(
        { success: false, message: "Invalid email or phone number" },
        { status: 400 }
      );
    }

    const res = await axios.post(
      `${Host}/api/auth/signin`,
      {
        email: isEmail ? username : null,
        phone_number: isPhone ? username : null,
        password,
      },
      {
        timeout: 25000,
        headers: { "Content-Type": "application/json" },
      }
    );


    // signin send otp and token will be set in otpverify after user enters OTP
    return NextResponse.json({
      success: true,
      message: res.data.message || "OTP sent to your email. Please verify.",
      email: isEmail ? username : null, // pass back so frontend knows where to send OTP
    });

  } catch (error: any) {
    console.error("Signin error:", error);
    const { message, status } = handleAxiosError(error);
    return NextResponse.json({ success: false, message }, { status });
  }
}