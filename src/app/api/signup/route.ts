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
        
        return NextResponse.json({
            success: false,
            message: error.response?.data?.message || "Something went wrong"
        }, { status: error.response?.status || 500 });
    }
}