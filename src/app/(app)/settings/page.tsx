import "./settings.css";
import { cookies } from "next/headers";
import axios from "axios";
import { Host } from "@/components/Global-exports/global-exports";
import { SettingsErrorHandler } from "./setting-comp/settings-error-handler";
import { Settingheader } from "./setting-comp/settingheader";
import { Settingsubs } from "./setting-comp/settingsubs";
import { Settingcontact } from "./setting-comp/settingcontact";

const Settings = async () => {
  let email, phone_number, next_billing, plan_name, status;
  let errorMessage: string | null = null;

  try {
    const cookie = await cookies();
    const token = cookie.get("token")?.value;

    if (!token) {
      errorMessage = "Authentication required. Please sign in.";
    } else {
      const res = await axios.get(`${Host}/api/setting/settings`, {
        headers: { Authorization: token }  
      });

      const data = res.data.data;
      email = data.email;
      phone_number = data.phone_number;

      const rawBilling = data.next_billing;
      if (!rawBilling) {
        next_billing = "Not scheduled";
      } else {
        const ms = new Date(rawBilling).getTime();
        next_billing = isNaN(ms) || ms <= 0
          ? "Not scheduled"
          : new Date(rawBilling).toLocaleDateString("en-IN", {
              day: "2-digit", month: "short", year: "numeric",
            });
      }

      plan_name = data.plan_name;
      status = data.status;
    }
  } catch (error: any) {
    console.error(error);
    errorMessage = error?.response?.data?.message
      || "Failed to load your settings. Please refresh the page.";
  }

  return (
    <div className="setting-main-div">
      <div className="settings-ambient" aria-hidden />
      <div className="settings-page-inner">
        <SettingsErrorHandler error={errorMessage} />
        <Settingheader />
        <Settingsubs plan_name={plan_name} next_billing={next_billing} />
        <Settingcontact email={email} phone_number={phone_number} />
      </div>
    </div>
  );
};


export default Settings; 