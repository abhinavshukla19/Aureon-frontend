import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Host } from "../../../../Components/Global-exports/global-exports";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  console.log(username, password);
  
  try {
    const res = await axios.post(`${Host}/signin`, {
      email: username,
      password
    });
    
    
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
    
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: "Something went wrong"
    }, {
      status: 500 // Changed to 500
    });
  }
}