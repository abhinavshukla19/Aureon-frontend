import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Host } from "@/components/Global-exports/global-exports";
import { handleAxiosError } from "../ApiErrorHandler/errorHadler";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authentication required. Please sign in." },
        { status: 401 }
      );
    }

    const res = await axios.post(
      `${Host}/api/update/request-password-change`,
      {},
      {
        timeout: 25000,
        headers: {
          "Content-Type": "application/json",
          "token": token   // keep as is
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: res.data.message || "OTP sent to your email.",
      email: res.data.email,
    });

  } catch (error: any) {
    console.error("Request password change error:", error);
    const { message, status } = handleAxiosError(error);
    return NextResponse.json({ success: false, message }, { status });
  }
}