import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Host } from "../../../../Components/Global-exports/global-exports";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  // using rezex to check  if email or phonenumber
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
  const isPhone = /^[0-9]{10}$/.test(username);

  if (!isEmail && !isPhone) {
    return NextResponse.json(
      { success: false, message: "Invalid email or phone number" },
      { status: 400 }
    );
  }
  console.log({
      email: isEmail ? username : null,
      phone_number: isPhone ? username : null,
      password
    })
  
  try {
    const res = await axios.post(`${Host}/signin`, {
      email: isEmail ? username : null,
      phone_number: isPhone ? username : null,
      password
    });
    
    console.log(req.body)
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
    return NextResponse.json({
      success: false,
      message: "Something went wrong"
    }, {
      status: 500 // Changed to 500
    });
  }
}