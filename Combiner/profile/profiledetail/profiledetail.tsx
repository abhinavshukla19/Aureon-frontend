import "./profiledetail.css";
import { Calendar, CreditCard, User, Mail } from "lucide-react";

type variable={
  username:string,
  email:string,
  phone_number:number;
  plan_name: string | null;
  member_since: string | undefined;
  is_verified: boolean | undefined;
}

export const Profile_detail = async({username , email , phone_number, plan_name, member_since, is_verified}:variable) => {
  // Calculate account age from member_since
  const calculateAccountAge = () => {
    if (!member_since) return "N/A";
    try {
      const memberDate = new Date(member_since);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - memberDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 30) {
        return `${diffDays} days`;
      } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} ${months === 1 ? 'month' : 'months'}`;
      } else {
        const years = Math.floor(diffDays / 365);
        const remainingMonths = Math.floor((diffDays % 365) / 30);
        if (remainingMonths === 0) {
          return `${years} ${years === 1 ? 'year' : 'years'}`;
        }
        return `${years} ${years === 1 ? 'year' : 'years'}, ${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`;
      }
    } catch {
      return "N/A";
    }
  };

  const accountAge = calculateAccountAge();

  const AccountInfo = [
    {
      label: "Account Age",
      value: accountAge,
      icon: Calendar,
      color: "#7c3aed",
      description: "Member since"
    },
    {
      label: "Current Plan",
      value: plan_name || "Free Plan",
      icon: CreditCard,
      color: "#10b981",
      description: "Subscription plan"
    },
    {
      label: "Username",
      value: username || "Not set",
      icon: User,
      color: "#f59e0b",
      description: "Your display name"
    },
    {
      label: "Email Verified",
      value: is_verified ? "Verified" : "Not verified", 
      icon: Mail,
      color: "#6366f1",
      description: email || "No email"
    }
  ];

  const Active = [
    {
      name: "Macbook M4 Pro",
      location: "Miami, Florida",
      session: "Current Session",
    },
    {
      name: "Oneplus Nord CE 4",
      location: "Los Santos, California",
      session: "Last session 10m ago",
    },
    {
      name: "Oneplus Tv",
      location: "North Yankton, USA",
      session: "Last session 2m ago",
    },
  ];

  const movie = [
    {
      name: "Money Heist",
      time: "2hr 55min",
      episode: "S03 EP-04",
      url: "https://svijetfilma.eu/wp-content/uploads/2020/03/Money-Heist-Season-4-1280x720-1.jpg",
    },
    {
      name: "Rana Naidu",
      time: "2hr 34min",
      episode: "S02 EP-06",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl7iX_Y-7TlMLT1_gpp6sdlv0KCw3GhJTLrQ&s",
    },
  ];

  return (
    <div className="profile-detail-main-div">
      {/* LEFT COLUMN */}
      <div className="left-column">
        {/* PERSONAL DETAILS */}
        <div className="card profile-card">
          <div className="card-header">
            <p className="card-title">Personal Details</p>
            <p className="card-subtitle">Manage your personal information</p>
          </div>

          <div className="info-box">
            <p className="name-para">{username}</p>
            <p className="mobile-para">{phone_number}</p>
          </div>

          <div className="info-box">
            <p className="email-para">{email}</p>
          </div>
        </div>

        {/* ACCOUNT INFORMATION */}
        <div className="card">
          <div className="card-header">
            <p className="card-title">Account Information</p>
            <p className="card-subtitle">Your account details and status</p>
          </div>

          <div className="stats-grid">
            {AccountInfo.map((info, idx) => {
              const IconComponent = info.icon;
              return (
                <div key={idx} className="stat-card">
                  <div className="stat-icon-wrapper" style={{ background: `${info.color}20`, borderColor: `${info.color}40` }}>
                    <IconComponent size={20} strokeWidth={2.5} style={{ color: info.color }} />
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

      {/* RIGHT COLUMN */}
      <div className="right-column">
        {/* ACTIVE DEVICES */}
        <div className="card">
          <p className="card-title">Active Devices</p>

          {Active.map((item, idx) => (
            <div key={idx} className="device-card">
              <p className="device-para">{item.name}</p>
              <p className="location-para">{item.location}</p>
              <p className="last-session-para">{item.session}</p>
            </div>
          ))}
        </div>

        {/* CONTINUE WATCHING */}
        <div className="card">
          <p className="card-title">Continue Watching</p>

          {movie.map((watching, idx) => (
            <div key={idx} className="watching-row">
              <img src={watching.url} alt={watching.name} />
              <div>
                <p className="watching-name">{watching.name}</p>
                <p className="watching-episode">{watching.episode}</p>
                <p className="watching-time">{watching.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
