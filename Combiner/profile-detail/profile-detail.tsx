import "./profile-detail.css";

export const Profile_detail = () => {
  const Preferences = [
    {
      option: "Autoplay next episode",
      text: "Automatically start the next episode when the current one ends",
    },
    {
      option: "Data Saver",
      text: "Reduce video quality to standard definition on mobile networks",
    },
    {
      option: "Autoplay previews",
      text: "Watch previews while browsing on all devices",
    },
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
            <p className="name-para">Michel De Santa</p>
            <p className="mobile-para">+91 8539895678</p>
          </div>

          <div className="info-box">
            <p className="email-para">micheldesanta@ifruit.com</p>
          </div>
        </div>

        {/* PLAYBACK PREFERENCES */}
        <div className="card">
          <p className="card-title">Playback Preferences</p>

          {Preferences.map((item, idx) => (
            <div key={idx} className="preference-row">
              <div>
                <p className="item-option">{item.option}</p>
                <p className="item-text">{item.text}</p>
              </div>

              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider"></span>
              </label>
            </div>
          ))}
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
