import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const cookie = await cookies();
        cookie.delete("token");

        return NextResponse.json(
            { 
                success: true,  
                message: "Signed out successfully" 
            },
            {
                status: 200
            }
        ); 

    } catch (error) {
        console.error("Signout error:", error);
        return NextResponse.json({
            success: false,
            message: "Error signing out"
        }, {
            status: 500
        });
    }
}