import "./settings.css";
import { Settingheader } from "./setting-comp/settingheader";
import { Settingsubs } from "./setting-comp/settingsubs";
import { Settingreset } from "./setting-comp/settingreset";
import { Settingcontact } from "./setting-comp/settingcontact";
import { SettingsErrorHandler } from "./setting-comp/settings-error-handler";
import { cookies, headers } from "next/headers";
import axios from "axios";
import { Host } from "../../../../Components/Global-exports/global-exports";


const Settings = async() => {
  let email , phone_number , next_billing , plan_name , status
  let errorMessage: string | null = null;
  
  try {
    const cookie=await cookies()
    const token=cookie.get("token")?.value;
    
    if (!token) {
      errorMessage = "Authentication required. Please sign in.";
    } else {
    const res=await axios.get(`${Host}/settings`,{headers:{token:token}})
    if(res.status===200){
      const data=res.data.data;
      email=data.email;
      phone_number=data.phone_number ; 
      next_billing=new Date(data.next_billing).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}); 
      plan_name=data.plan_name ; 
      status=data.status;
    }
    }

  } catch (error: any) {
    console.log(error);
    if (error?.response?.status === 401) {
      errorMessage = "Your session has expired. Please sign in again.";
    } else if (error?.response?.status === 403) {
      errorMessage = "You don't have permission to access this page.";
    } else if (error?.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else {
      errorMessage = "Failed to load settings. Please try again later.";
    }
  }

  return (
    <div className="setting-main-div">
      <SettingsErrorHandler error={errorMessage} />
      {/* HEADER */}
      <Settingheader />

      {/* SUBSCRIPTION CARD */}
        <Settingsubs plan_name={plan_name} next_billing={next_billing} />

      {/* ACCOUNT & SECURITY */}
        <Settingcontact email={email} phone_number={phone_number} />
    </div>
  );
};

export default Settings;
