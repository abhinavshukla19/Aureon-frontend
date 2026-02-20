import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { Host } from "@/components/Global-exports/global-exports";

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
        }, {
            timeout: 25000, // 25 seconds timeout (less than frontend to fail fast)
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (res.status === 201 && res.data.success) {
            // Don't set token during signup - user needs to verify OTP first
            // Token will be set after OTP verification in /api/otpverify
            
            return NextResponse.json({
                success: true,
                message: res.data.message || "Account created successfully. Please check your email for OTP."
            }, { status: 201 });
        }

        return NextResponse.json({
            success: false,
            message: res.data.message || "Signup failed"
        }, { status: 400 });

    } catch (error: any) {
        console.error("Signup error:", error);
        
        let errorMessage = "Something went wrong";
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
        } else if (error?.response?.status === 500) {
            errorMessage = "Our servers are experiencing issues. Please try again in a few moments.";
            statusCode = 500;
        } else if (error?.response?.status === 503) {
            errorMessage = "The service is temporarily unavailable. We're working on fixing it.";
            statusCode = 503;
        } else if (error?.response?.data?.message) {
            errorMessage = error.response.data.message;
            statusCode = error?.response?.status || 400;
        } else if (error?.response?.status === 409) {
            errorMessage = "An account with this email or phone number already exists. Please sign in instead.";
            statusCode = 409;
        } else if (error?.response?.status === 400) {
            errorMessage = "Invalid information provided. Please check all fields and try again.";
            statusCode = 400;
        }
        
        return NextResponse.json({
            success: false,
            message: errorMessage
        }, { status: statusCode });
    }
}