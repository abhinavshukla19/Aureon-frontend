import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { Host } from "@/components/Global-exports/global-exports";
import { cookies } from "next/headers";




export async function POST(req: NextRequest ) {
  const { movie_id , progress } = await req.json();
  
  if(!movie_id || progress==null){
    return NextResponse.json(
      { success: false, message: "Value not found" },
      { status: 400 }
    );
  }
    try {
        const cookiestore=await cookies();
        const token=cookiestore.get("token")?.value;

        const res=await axios.post(`${Host}/add_watching_timesatmp`,{ movie_id , progress } , {headers:{token:token}})
        if (!res.data?.success) {
        return NextResponse.json(
            { success: false },
            { status: 500 }
        );
        }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Update progress error:", error);
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}