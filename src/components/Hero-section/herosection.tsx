// import { Plus } from "lucide-react"
// import "./hero-section.css"

// export const Hero_section = () => {
//   const heromovie = {
//     name: "Love At First Sight",
//     lastname: "",
//     match: "98%",
//     year: "2025",
//     rating: "4K Ultra HD",
//     ageRating: "5.1",
//     description:
//       "Love at First Sight is a heartwarming romantic story that begins with a chance encounter and unfolds into an unforgettable connection. As two strangers navigate distance, timing, and fate, the film explores how fleeting moments can change lives forever. A tender exploration of destiny, hope, and emotional vulnerability."
//   }

//   return (
//     <section className="hero">
//       {/* 🎬 Background Video */}
//       <video
//         className="hero-video"
//         src="https://pub-0ab957bd269d4ddbb175b1627b53d2a4.r2.dev/Love--at-first-sight/movie/Love_at_First_Sight_Official_Trailer_Netflix_1080P.mp4"
//         autoPlay
//         muted
//         loop
//         playsInline
//       />

//       {/* 🎥 Hero Content */}
//       <div className="hero-content">
//         <span className="hero-tag">#1 IN MOVIES TODAY</span>

//         <h1 className="hero-title">
//           {heromovie.name}
//           {heromovie.lastname && <span>{heromovie.lastname}</span>}
//         </h1>

//         <div className="hero-meta">
//           <span className="match">{heromovie.match} Match</span>
//           <span className="year">{heromovie.year}</span>
//           <span className="rating">{heromovie.rating}</span>
//           <span className="age-rating">{heromovie.ageRating}</span>
//         </div>

//         <p className="hero-desc">{heromovie.description}</p>

//         <div className="hero-actions">
//           <button className="btn primary">▶ Play</button>
//           <button className="movie-icon-button"><Plus size={20} /></button>
//         </div>
//       </div>
//     </section>
//   )
// }



"use client"
import { Play, Volume2, VolumeX, Plus } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import "./hero-section.css"

export const Hero_section = () => {
  const [isMuted, setIsMuted] = useState(true)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const heroMovie = {
    name: "Love At First Sight",
    lastname: "",
    match: "98%",
    year: "2025",
    rating: "4K Ultra HD",
    ageRating: "5.1",
    duration: "1h 32m",
    genres: ["Romance", "Drama", "Feel-Good"],
    description:
      "Love at First Sight is a heartwarming romantic story that begins with a chance encounter and unfolds into an unforgettable connection. As two strangers navigate distance, timing, and fate, the film explores how fleeting moments can change lives forever.",
    // Fallback poster image - replace with your own
    posterUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&q=80"
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Set timeout - hide spinner after 8 seconds
    timeoutRef.current = setTimeout(() => {
      setIsVideoLoaded(true)
      if (!video.readyState || video.readyState < 2) {
        setVideoError(true)
      }
    }, 8000)

    const handleLoadedData = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setIsVideoLoaded(true)
      setVideoError(false)
    }

    const handleCanPlay = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setIsVideoLoaded(true)
      setVideoError(false)
    }

    const handleError = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setVideoError(true)
      setIsVideoLoaded(true)
    }

    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('error', handleError)

    // Attempt to load
    video.load()

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('error', handleError)
    }
  }, [])

  const handlePlayClick = () => {
    console.log("Playing movie...")
    // Add your play logic here
  }

  const handleAddToList = () => {
    console.log("Added to list")
    // Add to list logic
  }

  return (
    <section className="hero-section">
      {/* Background - Video or Fallback */}
      <div className="hero-video-wrapper">
        {!videoError ? (
          <video
            ref={videoRef}
            className={`hero-background-video ${isVideoLoaded ? 'loaded' : ''}`}
            src="https://pub-0ab957bd269d4ddbb175b1627b53d2a4.r2.dev/Love--at-first-sight/movie/Love_at_First_Sight_Official_Trailer_Netflix_1080P.mp4"
            poster={heroMovie.posterUrl}
            autoPlay
            muted={isMuted}
            loop
            playsInline
            preload="auto"
          />
        ) : (
          // Fallback: Beautiful gradient background with poster
          <div 
            className="hero-background-fallback"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url(${heroMovie.posterUrl})`
            }}
          />
        )}
        
        {/* Gradient Overlays */}
        <div className="hero-gradient-overlay" />
        <div className="hero-vignette" />
        <div className="hero-left-gradient" />
      </div>

      {/* Main Content */}
      <div className="hero-container">
        <div className="hero-content-wrapper">
          
          {/* Trending Badge */}
          <div className="hero-badge-wrapper">
            <span className="hero-trending-badge">
              <span className="badge-icon">🔥</span>
              #1 IN MOVIES TODAY
            </span>
          </div>

          {/* Title */}
          <div className="hero-title-section">
            <h1 className="hero-main-title">
              {heroMovie.name}
              {heroMovie.lastname && (
                <span className="hero-subtitle-text"> {heroMovie.lastname}</span>
              )}
            </h1>
          </div>

          {/* Metadata */}
          <div className="hero-metadata">
            <span className="metadata-match">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              {heroMovie.match} Match
            </span>
            <span className="metadata-divider">•</span>
            <span className="metadata-year">{heroMovie.year}</span>
            <span className="metadata-divider">•</span>
            <span className="metadata-duration">{heroMovie.duration}</span>
            <span className="metadata-badge-quality">{heroMovie.rating}</span>
            <span className="metadata-badge-age">{heroMovie.ageRating}</span>
          </div>

          {/* Genres */}
          <div className="hero-genres">
            {heroMovie.genres.map((genre, index) => (
              <span key={index} className="genre-pill">{genre}</span>
            ))}
          </div>

          {/* Description */}
          <p className="hero-description">
            {heroMovie.description}
          </p>

          {/* Action Buttons */}
          <div className="hero-action-buttons">
            <button 
              className="hero-btn hero-btn-primary"
              onClick={handlePlayClick}
            >
              <Play className="btn-icon" fill="currentColor" />
              <span>Play Now</span>
            </button>
            

            <div className="hero-icon-buttons">
              <button 
                className="hero-icon-btn"
                onClick={handleAddToList}
                aria-label="Add to My List"
                title="Add to My List"
              >
                <Plus size={20} strokeWidth={2.5} />
              </button>
            
            </div>
          </div>
        </div>

        {/* Sound Control - Only if video loaded successfully */}
        {isVideoLoaded && !videoError && (
          <button 
            className="hero-sound-toggle"
            onClick={() => setIsMuted(!isMuted)}
            aria-label={isMuted ? "Unmute" : "Mute"}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX size={22} strokeWidth={2} />
            ) : (
              <Volume2 size={22} strokeWidth={2} />
            )}
          </button>
        )}

        {/* Age Rating */}
        <div className="hero-rating-info">
          <span className="rating-badge">{heroMovie.ageRating}</span>
        </div>
      </div>

      {/* Loading Spinner */}
      {!isVideoLoaded && !videoError && (
        <div className="hero-loading">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading preview...</p>
        </div>
      )}
    </section>
  )
}