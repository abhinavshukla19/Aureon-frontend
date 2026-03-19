import { Profile_detail } from "./components/profiledetail/profiledetail";
import { ProfileErrorHandler } from "./components/profile-error-handler";
import { Profilehead } from "./components/profilehead/profilehead";
import { Host } from "@/components/Global-exports/global-exports";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import "./profile.css";
import axios from "axios";

const Profile = async () => {
  let username, email, phone_number, plan_name, member_since, is_verified;
  let errorMessage: string | null = null;

  const cookie = await cookies();
  const token = cookie.get("token")?.value;

  if (!token) redirect("/signin");

  try {
    const res = await axios.get(`${Host}/api/profile/profile`, {
      headers: { token },
    });

    const data = res.data.data;
    username = data.username as string;
    email = data.email as string;
    phone_number = data.phone_number;
    plan_name = data.plan_name;
    member_since = new Date(data.member_since).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    is_verified = data.emailVerified; 

  } catch (error: any) {
    console.error("Profile error", error);
    errorMessage =
      error?.response?.data?.message ||
      "Failed to load profile. Please refresh the page.";
  }

  return (
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
        />
      </div>
    </div>
  );
};

export default Profile;