"use client"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Button } from "../../../Components/button/button";
import { useAlert } from "../../../Components/alert/alert";
import "./profilehead.css"

type Userdetail={
    username:string,
    plan_name:string,
    member_since:Date | any;
}

export const Profilehead=({member_since , plan_name , username}:Userdetail)=>{
    const router=useRouter();
    const { showSuccess, showError } = useAlert();

    const handlesignout = async () => {
    try {
        const res = await axios.post("/api/signout");
        
        if (res.data.success) {
            showSuccess(res.data.message || "Signed out successfully", "Signed Out");
            setTimeout(() => {
                router.push("/signin");
                router.refresh();
            }, 500);
        } else {
            showError(res.data.message || "Sign out failed", "Error");
        }

    } catch (error: any) {
        console.log("Catch block error:", error);         
        console.log("Error response:", error.response);     
        console.log("Error data:", error.response?.data);   
        showError(error?.response?.data?.message || "Failed to sign out. Please try again.", "Sign Out Failed");
    }
}

    return(
        <>
        <div className="profile-name-div">
            <div className="profile-avatar-div">
                <div className="profile-avatar">🧑🏻</div>
                <div className="profile-name">
                    <p>{username}</p>
                    <p>{plan_name}</p>
                    <p>Member Since : {member_since}</p>
                </div>
             </div> 
            <div className="profile-name-div-button">
                <Button onclick={handlesignout} buttonname="Sign out"/>
            </div>
        </div>
        </>
    )
}