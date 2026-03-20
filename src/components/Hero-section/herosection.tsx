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
    name: "People we meet on vacation",
    lastname: "",
    match: "98%",
    year: "2026",
    rating: "4K Ultra HD",
    /** Surround / spatial audio — shown once in metadata only */
    audioFormat: "5.1",
    duration: "1h 52m",
    genres: ["Romance", "Drama", "Feel-Good"],
    description:
      "People we meet on vacation is a heartwarming romantic story that begins with a chance encounter and unfolds into an unforgettable connection. As two strangers navigate distance, timing, and fate, the film explores how fleeting moments can change lives forever.",
    posterUrl:
      "https://dnm.nflximg.net/api/v6/BvVbc2Wxr2w6QuoANoSpJKEIWjQ/AAAAQX109M3039unqsrU2LMU3y3f-kBN5Y5v4R0482N8pTexwgxoHxi4f7CKG4zUy0e_PiSTv7mjBwin4QVN2j6f6U9KFzobPEr-oC8ROzGgCpGNq7xE46tA-NlGs79R3fbigrYMpz2V_nS9fH8bdu1elfYJ3m4.jpg?r=c02",
  }

  const heroVideoSrc =
    "https://pub-0ab957bd269d4ddbb175b1627b53d2a4.r2.dev/people%20we%20meet%20at%20vaction/trailer/People%20We%20Meet%20On%20Vacation%20%20Official%20Teaser%20%20Netflix%20-%20Netflix%20(1080p%2C%20h264).mp4"

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
      <div
        className="hero-video-wrapper"
        style={{
          backgroundImage: `url(${heroMovie.posterUrl})`,
        }}
      >
        {!videoError ? (
          <video
            ref={videoRef}
            className={`hero-background-video ${isVideoLoaded ? 'loaded' : ''}`}
            src={heroVideoSrc}
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
        {/* Soften typical trailer watermark corners without heavy UI */}
        <div className="hero-watermark-shield hero-watermark-shield--tr" aria-hidden />
        <div className="hero-watermark-shield hero-watermark-shield--br" aria-hidden />
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
            <span className="metadata-badge-age">{heroMovie.audioFormat}</span>
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