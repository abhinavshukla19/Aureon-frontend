"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button/button";
import { useAlert } from "@/components/alert/alert";
import "./profilehead.css";

type Userdetail = {
  username: string;
  plan_name: string;
  member_since: string | any;
};

function initialsFromUsername(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const Profilehead = ({ member_since, plan_name, username }: Userdetail) => {
  const router = useRouter();
  const { showSuccess, showError } = useAlert();
  const initials = initialsFromUsername(username || "");

  const handlesignout = async () => {
    try {
      const res = await axios.post("/api/signout");

      if (res.data.success) {
        showSuccess("Signed out successfully", "Signed Out");
        setTimeout(() => {
          router.push("/signin");
          router.refresh();
        }, 500);
      } else {
        showError(res.data.message || "Sign out failed", "Error");
      }

    } catch (error: any) {
      showError(
        error?.response?.data?.message || "Failed to sign out. Please try again.",
        "Sign Out Failed"
      );
    }
  };

  return (
    <header className="profile-name-div" aria-labelledby="profile-display-name">
      <div className="profile-avatar-div">
        <div className="profile-avatar-ring" aria-hidden>
          <div className="profile-avatar">
            <span className="profile-avatar-initials">{initials}</span>
          </div>
        </div>
        <div className="profile-name">
          <div className="profile-name-row">
            <p id="profile-display-name" className="profile-username">
              {username}
            </p>
            <span className="profile-live-pill" title="Account active">
              <span className="profile-live-dot" aria-hidden />
              Active
            </span>
          </div>
          <p className="profile-plan">{plan_name || "Member"}</p>
          <p className="profile-member-since">
            <span className="profile-member-label">Member since</span>
            <span className="profile-member-date">{member_since}</span>
          </p>
        </div>
      </div>
      <div className="profile-name-div-button">
        <Button onclick={handlesignout} buttonname="Sign out" />
      </div>
    </header>
  );
};