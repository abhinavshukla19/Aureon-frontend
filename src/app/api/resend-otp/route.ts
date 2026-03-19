import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { Host } from "@/components/Global-exports/global-exports";
import { handleAxiosError } from "../ApiErrorHandler/errorHadler";

export async function POST(req: NextRequest) {
  try {
    const { email, purpose } = await req.json();

    if (!email || !purpose) {
      return NextResponse.json(
        { success: false, message: "Email and purpose are required" },
        { status: 400 }
      );
    }

    const validPurposes = ["signup", "signin", "password_change", "email_change"];
    if (!validPurposes.includes(purpose)) {
      return NextResponse.json(
        { success: false, message: "Invalid purpose" },
        { status: 400 }
      );
    }

    const res = await axios.post(
      `${Host}/api/otp/resend-otp`,
      { email, purpose },
      {
        timeout: 25000,
        headers: { "Content-Type": "application/json" },
      }
    );

    return NextResponse.json({
      success: true,
      message: res.data.message || "OTP sent successfully",
    });

  } catch (error: any) {
    console.error("Resend OTP error:", error);
    const { message, status } = handleAxiosError(error);
    return NextResponse.json({ success: false, message }, { status });
  }
}
