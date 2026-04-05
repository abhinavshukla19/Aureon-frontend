"use client"
import { Play, Volume2, VolumeX, Plus, Check } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useMyListToggle } from "@/hooks/useMyListToggle"
import { fetchMyListContains } from "@/lib/mylist-client"
import { getYoutubeVideoId, buildYoutubeHeroEmbedSrc } from "@/lib/youtube-url"
import "./hero-section.css"

type HeroSectionProps = {
  token: string
  featuredMovieId: number | null
  // ✅ Pass hero data from parent instead of hardcoding
  heroMovie: {
    name: string
    match: string
    year: string
    rating: string
    audioFormat: string
    duration: string
    genres: string[]
    description: string
    posterUrl: string
    videoUrl: string
  }
}

export const Hero_section = ({ token, featuredMovieId, heroMovie }: HeroSectionProps) => {
  const router = useRouter()
  const ytId = getYoutubeVideoId(heroMovie.videoUrl)
  const [isMuted, setIsMuted] = useState(true)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // ── My List ───────────────────────────────────────────────────────
  const { toggle: toggleMyList, busyMovieId } = useMyListToggle(token)
  const isListBusy = busyMovieId === featuredMovieId  // ✅ fixed
  const [heroInMyList, setHeroInMyList] = useState(false)

  useEffect(() => {
    if (featuredMovieId == null || !token) { setHeroInMyList(false); return }
    let cancelled = false
    void fetchMyListContains(token, featuredMovieId)
      .then((v) => { if (!cancelled) setHeroInMyList(v) })
      .catch(() => { if (!cancelled) setHeroInMyList(false) })
    return () => { cancelled = true }
  }, [featuredMovieId, token])

  // ── Video ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (ytId) return
    const video = videoRef.current
    if (!video) return

    let overlayDismissed = false
    const dismissOverlay = () => {
      if (overlayDismissed) return
      overlayDismissed = true
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setShowLoadingOverlay(false)
    }

    timeoutRef.current = setTimeout(() => {
      dismissOverlay()
      setIsVideoLoaded(true)
      if (!video.readyState || video.readyState < 2) setVideoError(true)
    }, 12000)

    const handleLoadedMetadata = () => dismissOverlay()
    const handleCanPlay = () => { dismissOverlay(); setIsVideoLoaded(true); setVideoError(false) }
    const handleError = () => { dismissOverlay(); setVideoError(true); setIsVideoLoaded(true) }

    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    video.addEventListener("canplay", handleCanPlay)
    video.addEventListener("error", handleError)
    video.load()

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video.removeEventListener("canplay", handleCanPlay)
      video.removeEventListener("error", handleError)
    }
  }, [heroMovie.videoUrl, ytId])

  // ── Handlers ──────────────────────────────────────────────────────
  const handlePlayClick = () => {
    if (featuredMovieId) router.push(`/movie-detail/${featuredMovieId}`)  // ✅ fixed
  }

  const handleAddToList = () => {
    if (featuredMovieId == null) return
    void toggleMyList(featuredMovieId, setHeroInMyList)
  }

  return (
    <section className="hero-section">
      <div className="hero-video-wrapper" style={{ backgroundImage: `url(${heroMovie.posterUrl})` }}>
        {!videoError ? (
          ytId ? (
            <iframe
              title="Featured title background preview"
              aria-hidden
              className={`hero-youtube-embed ${isVideoLoaded ? "loaded" : ""}`}
              src={buildYoutubeHeroEmbedSrc(ytId)}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              onLoad={() => {
                setShowLoadingOverlay(false)
                setIsVideoLoaded(true)
                setVideoError(false)
              }}
            />
          ) : (
            <video
              ref={videoRef}
              className={`hero-background-video ${isVideoLoaded ? "loaded" : ""}`}
              src={heroMovie.videoUrl}
              poster={heroMovie.posterUrl}
              autoPlay
              muted={isMuted}
              loop
              playsInline
              preload="metadata"
            />
          )
        ) : (
          <div
            className="hero-background-fallback"
            style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.8)), url(${heroMovie.posterUrl})` }}
          />
        )}
        <div className="hero-gradient-overlay" />
        <div className="hero-vignette" />
        <div className="hero-left-gradient" />
        <div className="hero-watermark-shield hero-watermark-shield--tr" aria-hidden />
        <div className="hero-watermark-shield hero-watermark-shield--br" aria-hidden />
      </div>

      <div className="hero-container">
        <div className="hero-content-wrapper">
          <div className="hero-badge-wrapper">
            <span className="hero-trending-badge">
              <span className="badge-icon">🔥</span>
              #1 IN MOVIES TODAY
            </span>
          </div>

          <div className="hero-title-section">
            <h1 className="hero-main-title">{heroMovie.name}</h1>  {/* ✅ removed useless lastname */}
          </div>

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

          <div className="hero-genres">
            {heroMovie.genres.map((genre, index) => (
              <span key={index} className="genre-pill">{genre}</span>
            ))}
          </div>

          <p className="hero-description">{heroMovie.description}</p>

          <div className="hero-action-buttons">
            <button type="button" className="hero-btn hero-btn-primary" onClick={handlePlayClick}>
              <Play className="btn-icon" fill="currentColor" />
              <span>Play Now</span>
            </button>

            <div className="hero-icon-buttons">
              <button
                type="button"
                className={`hero-icon-btn${heroInMyList ? " hero-icon-btn--in-list" : ""}`}
                onClick={handleAddToList}
                disabled={featuredMovieId == null || isListBusy}
                aria-label={heroInMyList ? "Remove from My List" : "Add to My List"}
                title={heroInMyList ? "Remove from My List" : "Add to My List"}
                aria-pressed={heroInMyList}
              >
                {heroInMyList ? <Check size={20} strokeWidth={2.5} /> : <Plus size={20} strokeWidth={2.5} />}
              </button>
            </div>
          </div>
        </div>

        {isVideoLoaded && !videoError && !ytId && (
          <button
            type="button"
            className="hero-sound-toggle"
            onClick={() => setIsMuted(!isMuted)}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={22} strokeWidth={2} /> : <Volume2 size={22} strokeWidth={2} />}
          </button>
        )}
      </div>

      {showLoadingOverlay && (
        <div className="hero-loading">
          <div className="loading-spinner" />
          <p className="loading-text">Loading preview...</p>
        </div>
      )}
    </section>
  )
}