import "./profiledetail.css";
import Link from "next/link";
import { ArrowUpRight, Calendar, CreditCard, Mail, ShieldCheck, User } from "lucide-react";
import { ProfileContinueWatching } from "../profile cw/profile-cw";

type ProfileProps = {
  username: string;
  email: string;
  phone_number: number;
  plan_name: string | null;
  member_since: string | undefined;
  is_verified: boolean | undefined;
};

export const Profile_detail = ({
  username,
  email,
  phone_number,
  plan_name,
  member_since,
  is_verified,
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
      ? `${years} ${years === 1 ? "year" : "years"}, ${remMonths} ${remMonths === 1 ? "month" : "months"}`
      : `${years} ${years === 1 ? "year" : "years"}`;
  };

  const AccountInfo = [
    {
      label: "Account Age",
      value: calculateAccountAge(),
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

  return (
    <section className="profile-detail-main-div">
      <header className="profile-detail-header">
        <div className="profile-detail-header-copy">
          <p className="profile-detail-eyebrow">Your space</p>
          <h2 className="profile-detail-title aureon-heading-gradient">
            Account overview
          </h2>
          <p className="profile-detail-subtitle">
            Personal details, plan, and picks you left mid-watch — all in one
            place.
          </p>
        </div>
        <Link href="/newmovie" className="profile-detail-cta">
          <span>Browse catalog</span>
          <ArrowUpRight size={18} strokeWidth={2.2} aria-hidden />
        </Link>
      </header>

      <div className="profile-detail-grid">
        {/* LEFT */}
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

            <div className="info-box info-box-email">
              <div className="info-email-row">
                <div>
                  <p className="field-label">Email</p>
                  <p className="email-para">{email}</p>
                </div>
                {is_verified ? (
                  <span className="email-verified-chip">
                    <ShieldCheck size={14} strokeWidth={2.5} aria-hidden />
                    Verified
                  </span>
                ) : (
                  <span className="email-pending-chip">Unverified</span>
                )}
              </div>
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

        {/* RIGHT */}
        <div className="right-column">
          <div className="card">
            <div className="card-header card-header--compact">
              <p className="card-title">Continue watching</p>
              <p className="card-subtitle">
                Pick up right where you left off.
              </p>
            </div>
            <ProfileContinueWatching />
          </div>
        </div>
      </div>
    </section>
  );
};