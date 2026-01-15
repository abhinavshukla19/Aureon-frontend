import "./hero-section.css"

export const Hero_section = () => {
  const heromovie = {
    name: "DHURENDHAR",
    lastname: "",
    match: "98%",
    year: "2026",
    rating: "4K Ultra HD",
    ageRating: "5.1",
    description:
      "In a future where silence is currency, a rogue data courier discovers a frequency that could rewrite human history. Now, she must outrun the very system she helped build."
  }

  return (
    <section className="hero">
      {/* 🎬 Background Video */}
      <video
        className="hero-video"
        src="./video/Naal_Nachna.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* 🎥 Hero Content */}
      <div className="hero-content">
        <span className="hero-tag">#1 IN MOVIES TODAY</span>

        <h1 className="hero-title">
          {heromovie.name}
          {heromovie.lastname && <span>{heromovie.lastname}</span>}
        </h1>

        <div className="hero-meta">
          <span className="match">{heromovie.match} Match</span>
          <span className="year">{heromovie.year}</span>
          <span className="rating">{heromovie.rating}</span>
          <span className="age-rating">{heromovie.ageRating}</span>
        </div>

        <p className="hero-desc">{heromovie.description}</p>

        <div className="hero-actions">
          <button className="btn primary">▶ Play</button>
          <button className="btn secondary">ℹ More Info</button>
        </div>
      </div>
    </section>
  )
}