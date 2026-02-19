import { userAgent } from "next/server";
import "./profiledetail.css";
import { Calendar, CreditCard, User, Mail } from "lucide-react";
import { headers } from "next/headers";
import { Active_device } from "../active-devices/active";
import { ProfileContinueWatching } from "../../../Components/continue-watching/profile-cw";
import { AxiosHeaderValue } from "axios";

type ProfileProps = {
  username: string;
  email: string;
  phone_number: number;
  plan_name: string | null;
  member_since: string | undefined;
  is_verified: boolean | undefined;
  token: AxiosHeaderValue | undefined;
};

export const Profile_detail = async ({
  username,
  email,
  phone_number,
  plan_name,
  member_since,
  is_verified,
  token,
}: ProfileProps) => {
  const calculateAccountAge = () => {
    if (!member_since) return "N/A";

    const days = Math.floor(
      (Date.now() - new Date(member_since).getTime()) / 86400000
    );

    if (days < 30) return `${days} days`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months} ${months === 1 ? "month" : "months"}`;

    const years = Math.floor(months / 12);
    const remMonths = months % 12;

    return remMonths
      ? `${years} ${years === 1 ? "year" : "years"}, ${remMonths} ${
          remMonths === 1 ? "month" : "months"
        }`
      : `${years} ${years === 1 ? "year" : "years"}`;
  };

  const accountAge = calculateAccountAge();

  const AccountInfo = [
    {
      label: "Account Age",
      value: accountAge,
      icon: Calendar,
      color: "#7c3aed",
      description: "Member since",
    },
    {
      label: "Current Plan",
      value: plan_name || "Free Plan",
      icon: CreditCard,
      color: "#10b981",
      description: "Subscription plan",
    },
    {
      label: "Username",
      value: username || "Not set",
      icon: User,
      color: "#f59e0b",
      description: "Your display name",
    },
    {
      label: "Email Verified",
      value: is_verified ? "Verified" : "Not verified",
      icon: Mail,
      color: "#6366f1",
      description: email || "No email",
    },
  ];


  // keep for later 

  // const headersList = await headers();
  // const ua = userAgent({ headers: headersList });

  // const device = ua.device?.type ?? "desktop";
  // const os = ua.os?.name ?? "unknown";
  // const browser = ua.browser?.name ?? "unknown";

  // let ip =
  //   headersList.get("x-forwarded-for")?.split(",")[0] ||
  //   headersList.get("x-real-ip") ||
  //   "";

  // if (!ip || ip === "::1" || ip === "127.0.0.1") {
  //   ip = "8.8.8.8";
  // }

  // let location = "Unknown";

  // try {
  //   const res = await fetch(`https://ipapi.co/${ip}/json/`);
  //   const data = await res.json();
  //   location = `${data.city ?? "Bhagalpur"}, ${data.country_name ?? "India"}`;
  // } catch {
  //   location = "Unknown";
  // }

  // console.log(os, browser, location, device);

  
  return (
    <section className="profile-detail-main-div">
      <header className="profile-detail-header">
        <div>
          <p className="profile-detail-eyebrow">Profile</p>
          <h2 className="profile-detail-title">Account overview</h2>
          <p className="profile-detail-subtitle">
            Manage your personal info, subscription and where you're signed in.
          </p>
        </div>
      </header>

      <div className="profile-detail-grid">
        <div className="left-column">
          <div className="card profile-card">
            <div className="card-header">
              <p className="card-title">Personal details</p>
              <p className="card-subtitle">
                These details are tied to your Aureon account.
              </p>
            </div>

            <div className="info-box info-box--split">
              <div className="info-field">
                <p className="field-label">Full name</p>
                <p className="name-para">{username}</p>
              </div>
              <div className="info-field">
                <p className="field-label">Phone</p>
                <p className="mobile-para">{phone_number}</p>
              </div>
            </div>

            <div className="info-box">
              <p className="field-label">Email</p>
              <p className="email-para">{email}</p>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <p className="card-title">Account & subscription</p>
              <p className="card-subtitle">
                Quick snapshot of your membership status.
              </p>
            </div>

            <div className="stats-grid">
              {AccountInfo.map((info, idx) => {
                const IconComponent = info.icon;
                return (
                  <div key={idx} className="stat-card">
                    <div
                      className="stat-icon-wrapper"
                      style={{
                        background: `${info.color}10`,
                        borderColor: `${info.color}30`,
                      }}
                    >
                      <IconComponent
                        size={20}
                        strokeWidth={2.4}
                        style={{ color: info.color }}
                      />
                    </div>
                    <div className="stat-content">
                      <p className="stat-value">{info.value}</p>
                      <p className="stat-label">{info.label}</p>
                      <p className="stat-description">{info.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="right-column">
          <div className="card">
            <div className="card-header card-header--compact">
              <p className="card-title">Active devices</p>
              <p className="card-subtitle">
                Review where your Aureon account is currently signed in.
              </p>
            </div>
            <Active_device />
          </div>

          <div className="card">
            <div className="card-header card-header--compact">
              <p className="card-title">Continue watching</p>
              <p className="card-subtitle">
                Pick up right where you left off across any device.
              </p>
            </div>
            <ProfileContinueWatching token={token} />
          </div>
        </div>
      </div>
    </section>
  );
};
