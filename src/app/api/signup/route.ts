import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { Host } from "@/components/Global-exports/global-exports";
import { handleAxiosError } from "../ApiErrorHandler/errorHadler";

export async function POST(req: NextRequest) {
  try {
    const { username, email, password, phone_number } = await req.json();

    if (!username || !email || !password || !phone_number) {
      return NextResponse.json({
        success: false,
        message: "All fields are required"
      }, { status: 400 });
    }

    const res = await axios.post(`${Host}/api/auth/signup`, {
      username,
      email,
      password,
      phone_number,
    }, {
      timeout: 25000,
      headers: { "Content-Type": "application/json" }
    });

    return NextResponse.json({
      success: true,
      message: res.data.message || "Account created successfully. Please check your email for OTP."
    }, { status: 201 });

  } catch (error: any) {
    console.error("Signup error:", error);
    const { message, status } = handleAxiosError(error);
    return NextResponse.json({ success: false, message }, { status });
  }
}