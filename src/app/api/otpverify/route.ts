import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { Host } from "@/components/Global-exports/global-exports";
import { handleAxiosError } from "../ApiErrorHandler/errorHadler";

export async function POST(req: NextRequest) {
  try {
    const { email, otp, purpose, newPassword } = await req.json();

    if (!email || !otp || !purpose) {
      return NextResponse.json(
        { success: false, message: "Email, OTP and purpose are required" },
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

    if (purpose === "password_change") {
      if (
        newPassword == null ||
        typeof newPassword !== "string" ||
        newPassword.length < 6
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "New password is required (at least 6 characters)",
          },
          { status: 400 }
        );
      }
    }

    const res = await axios.post(
      `${Host}/api/otp/otpverify`,
      {
        email,
        otp,
        purpose,
        ...(purpose === "password_change" ? { newPassword } : {}),
      },
      {
        timeout: 25000,
        headers: { "Content-Type": "application/json" },
      }
    );

    const token = res.data?.token;

    const response = NextResponse.json({
      success: true,
      message: res.data?.message || "OTP verified successfully",
      newEmail: res.data?.newEmail || null,
    });

    // Set cookie for signup and signin only 
    if (token && (purpose === "signup" || purpose === "signin")) {
      response.cookies.set({
        name: "token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });
    }

    return response;

  } catch (error: any) {
    console.error("OTP verification error:", error);
    const { message, status } = handleAxiosError(error);
    return NextResponse.json({ success: false, message }, { status });
  }
}