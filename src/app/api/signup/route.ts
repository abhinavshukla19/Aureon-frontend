import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers"; // ADD THIS
import { Host } from "../../../../Components/Global-exports/global-exports";

export async function POST(req: NextRequest) {
    try {
        // MOVE THIS INSIDE TRY BLOCK
        const { username, email, password, phone_number } = await req.json();
        
        console.log(username, email, password, phone_number);

        if (!username || !email || !password || !phone_number) {
            return NextResponse.json({
                success: false,
                message: "All fields are required"
            }, { status: 400 });
        }

        const res = await axios.post(`${Host}/signup`, {
            username,
            email,
            password,
            phone_number,
        });

        if (res.status === 201 && res.data.success) {
            (await cookies()).set({
                name: "token",
                value: res.data.token,
                httpOnly: true,
                secure: false,
                sameSite: "lax",
                path: "/",
                maxAge: 60 * 60 * 24 * 7,
            });

            return NextResponse.json({
                success: true,
                message: res.data.message || "Account created successfully"
            }, { status: 201 });
        }

        return NextResponse.json({
            success: false,
            message: res.data.message || "Signup failed"
        }, { status: 400 });

    } catch (error: any) {
        console.error("Signup error:", error);
        
        let errorMessage = "Something went wrong";
        
        if (error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND') {
            errorMessage = "Unable to connect to the server. Please check your internet connection and try again.";
        } else if (error?.response?.status === 500) {
            errorMessage = "Our servers are experiencing issues. Please try again in a few moments.";
        } else if (error?.response?.status === 503) {
            errorMessage = "The service is temporarily unavailable. We're working on fixing it.";
        } else if (error?.message?.includes('timeout')) {
            errorMessage = "The request took too long. Please check your connection and try again.";
        } else if (error?.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error?.response?.status === 409) {
            errorMessage = "An account with this email or phone number already exists. Please sign in instead.";
        } else if (error?.response?.status === 400) {
            errorMessage = "Invalid information provided. Please check all fields and try again.";
        }
        
        return NextResponse.json({
            success: false,
            message: errorMessage
        }, { status: error?.response?.status || 500 });
    }
}