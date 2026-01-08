import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { Host } from "../../../../Components/Global-exports/global-exports";


export async function POST(req:NextRequest){
    const { username , email , password , phone_number }=await req.json()
    console.log(username , email , password , phone_number )
    try {
        const res=await axios.post(`${Host}/signup`,{
            username , email , password , phone_number
        })

        if(res.data.status==20){
        return NextResponse.json({
                success: true,
                message: "User created"
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
    } catch (error) {
        console.log(error)
        return NextResponse.json({
        success: false,
        message: "Something went wrong"
        }, {
        status: 500 // Changed to 500
        });
    }
}