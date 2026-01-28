import { Profile_detail } from "../../../../Combiner/profile/profiledetail/profiledetail";
import { ProfileErrorHandler } from "../../../../Combiner/profile/profile-error-handler";
import { Profilehead } from "../../../../Combiner/profile/profilehead/profilehead";
import { Host } from "../../../../Components/Global-exports/global-exports";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import "./profile.css"
import axios from "axios";


const Profile=async()=>{
    let username , email , phone_number , plan_name , member_since , is_verified;
    let errorMessage: string | null = null;
    const cookie=await cookies()
    const token=cookie.get("token")?.value
    if (!token) {
        redirect("/signin")
    }
    
     try {
      
        const res=await axios.get(`${Host}/profile`,{headers:{token :token}})
        const data=res.data.data
        username=data.username as string;
        email=data.email as string;
        phone_number=data.phone_number,
        plan_name=data.plan_name,
        member_since=new Date(data.member_since).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
        is_verified=data.is_verified;

      }
    catch (error: any) {
        console.log("Profile error" , error);
        if (error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND') {
            errorMessage = "Unable to connect to the server. Please check your internet connection.";
        } else if (error?.response?.status === 401) {
            errorMessage = "Your session has expired. Please sign in again to view your profile.";
        } else if (error?.response?.status === 403) {
            errorMessage = "You don't have permission to access this profile. Please contact support if this is an error.";
        } else if (error?.response?.status === 500) {
            errorMessage = "Our servers are experiencing issues. Please try again in a few moments.";
        } else if (error?.response?.status === 503) {
            errorMessage = "The service is temporarily unavailable. We're working on fixing it.";
        } else if (error?.message?.includes('timeout')) {
            errorMessage = "The request took too long. Please check your connection and try again.";
        } else if (error?.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else {
            errorMessage = "Failed to load your profile information. Please refresh the page or try again later.";
        }
    }

   
    return(
        <div className="profile-main-div">
            <ProfileErrorHandler error={errorMessage} />

            <Profilehead 
              username={username as string} 
              plan_name={plan_name as string} 
              member_since={member_since} 
            />

            <div className="profile-detail-div">
              <Profile_detail 
                username={username as string} 
                email={email as string} 
                phone_number={phone_number}
                plan_name={plan_name as string}
                member_since={member_since}
                is_verified={is_verified as boolean | undefined} 
                token={token}
              />
            </div>
        </div>
    )
}


export default Profile;