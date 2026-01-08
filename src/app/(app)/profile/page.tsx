import { Profile_detail } from "../../../../Combiner/profile/profiledetail/profiledetail";
import { ProfileErrorHandler } from "../../../../Combiner/profile/profile-error-handler";
import "./profile.css"
import { cookies } from "next/headers";
import axios from "axios";
import { Host } from "../../../../Components/Global-exports/global-exports";
import { Profilehead } from "../../../../Combiner/profile/profilehead/profilehead";


const Profile=async()=>{
    let username , email , phone_number , plan_name , member_since;
    let errorMessage: string | null = null;
    
     try {
      const cookie=await cookies()
      const token=cookie.get("token")?.value
      
      if (!token) {
        errorMessage = "Authentication required. Please sign in.";
      } else {
        const res=await axios.get(`${Host}/profile`,{headers:{token :token}})
        const data=res.data.data
        username=data.username as string;
        email=data.email as string;
        phone_number=data.phone_number,
        plan_name=data.plan_name,
        member_since=new Date(data.member_since).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
      }
    } 
    catch (error: any) {
        console.log("Profile error" , error);
        if (error?.response?.status === 401) {
            errorMessage = "Your session has expired. Please sign in again.";
        } else if (error?.response?.status === 403) {
            errorMessage = "You don't have permission to access this page.";
        } else if (error?.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else {
            errorMessage = "Failed to load profile. Please try again later.";
        }
    }
    
    return(
        <div className="profile-main-div">
            <ProfileErrorHandler error={errorMessage} />
            <Profilehead username={username as string} plan_name={plan_name as string} member_since={member_since} ></Profilehead>
            <Profile_detail 
              username={username as string} 
              email={email as string} 
              phone_number={phone_number}
              plan_name={plan_name as string}
              member_since={member_since}
            />
        </div>
    )
}


export default Profile;