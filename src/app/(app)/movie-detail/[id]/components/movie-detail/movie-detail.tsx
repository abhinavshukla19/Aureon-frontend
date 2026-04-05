"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Plus, Check, Info, Clock, Star, X, Volume2, VolumeX } from "lucide-react";
import { MoviePlayer } from "../movie-player/movie-player";
import { CastSection } from "../cast-section/cast-section";
import { RecommendationsGrid } from "../recommendation-grid/recommendation-grid";
import { toggleMyListItem } from "@/lib/mylist-client";
import { getYoutubeVideoId, buildYoutubeHeroEmbedSrc } from "@/lib/youtube-url";
import "./movie-detail.css";

type MovieDetailContentProps = {
  movie: any;
  cast: any[];
  recommendations: any[];
  progress: any;
  token: string;
  initialInMyList: boolean;
};

export function MovieDetailContent({
  movie,
  cast,
  recommendations,
  progress,
  token,
  initialInMyList,
}: MovieDetailContentProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInMyList, setIsInMyList] = useState(initialInMyList);
  const [showInfo, setShowInfo] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const detailYtId = getYoutubeVideoId(String(movie.movie_url ?? ""));

  const notify = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const handlePlay = () => {
    setIsPlaying(true);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    setIsInMyList(initialInMyList);
  }, [movie?.movie_id, initialInMyList]);

  const handleAddToList = async () => {
    try {
      const data = await toggleMyListItem(token, movie.movie_id);
      if (data.success) {
        const next = Boolean(data.inList);
        setIsInMyList(next);
        notify(data.message || (next ? "Added to your list" : "Removed from your list"));
      } else {
        notify(data.message || "Could not update your list", "error");
      }
    } catch (err: unknown) {
      const ax = err as { response?: { status?: number; data?: { message?: string } } };
      if (ax?.response?.status === 401) {
        notify("Please sign in again", "error");
      } else {
        notify(ax?.response?.data?.message || "Could not update your list", "error");
      }
    }
  };

  // const handleShare = async () => {
  //   const result = await shareMovie(movie.movie_id, movie.title);
  //   if (result.success && result.data) {
  //     try {
  //       await navigator.clipboard.writeText(result.data.shareUrl);
  //       notify('Link copied to clipboard!');
  //     } catch {
  //       notify('Unable to copy link', 'error');
  //     }
  //   }
  // };

  const toggleMute = () => {
    if (detailYtId) return;
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    if (detailYtId) return;
    if (videoRef.current && movie.movie_url) {
      videoRef.current.play().catch(() => {});
    }
  }, [movie.movie_url, detailYtId]);

  /** DB `duration` is minutes; resume / player use seconds */
  const durationMinutes = Number(movie.duration) || 0;
  const durationSeconds = durationMinutes * 60;
  const progressSeconds = progress
    ? Number(progress.progress_seconds) || 0
    : 0;
  const progressPercentage =
    progress && durationSeconds > 0
      ? Math.min(100, Math.round((progressSeconds / durationSeconds) * 100))
      : 0;

  const genrePills = movie.genre
    ? String(movie.genre)
        .split(",")
        .map((g: string) => g.trim())
        .filter(Boolean)
        .slice(0, 5)
    : [];

  const ratingDisplay =
    movie.rating != null && movie.rating !== ""
      ? typeof movie.rating === "number"
        ? Number.isInteger(movie.rating)
          ? String(movie.rating)
          : Number(movie.rating).toFixed(1)
        : String(movie.rating)
      : null;

  return (
    <>
      {/* Notification Toast */}
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          <div className="notification-content">
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Full Screen Player */}
      {isPlaying && (
        <MoviePlayer
          movieUrl={movie.movie_url}
          movieId={String(movie.movie_id)}
          resumeTime={progressSeconds}
          movieTitle={movie.title}
          onClose={() => setIsPlaying(false)}
        />
      )}

      {/* Hero Section with Video Background */}
      <div className="movie-hero" ref={heroRef}>
        <div className="movie-hero-background">
          {detailYtId ? (
            <iframe
              title="Title background preview"
              aria-hidden
              className="movie-hero-youtube"
              src={buildYoutubeHeroEmbedSrc(detailYtId)}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          ) : (
            <video
              ref={videoRef}
              className="hero-video"
              src={movie.movie_url}
              poster={movie.banner_url}
              loop
              muted={isMuted}
              playsInline
              autoPlay
            />
          )}
          <div className="hero-gradient" />
          <div className="md-hero-atmosphere" aria-hidden>
            <div className="md-hero-left-scrim" />
            <div className="md-hero-vignette" />
            <div className="md-hero-glow-bl" />
          </div>
        </div>

        <div className="movie-hero-content">
          <div className="hero-badge">
            {String(movie.type || "movie").toUpperCase()}
          </div>

          <h1 className="hero-title">{movie.title}</h1>
          
          {movie.tagline && (
            <p className="hero-tagline">{movie.tagline}</p>
          )}

          <div className="hero-meta">
            {movie.release_year != null && movie.release_year !== "" && (
              <>
                <span className="meta-year">{movie.release_year}</span>
                <span className="meta-separator">•</span>
              </>
            )}
            {ratingDisplay != null && (
              <>
                <span className="meta-rating">{ratingDisplay}</span>
                <span className="meta-separator">•</span>
              </>
            )}
            <span className="meta-duration">
              {durationMinutes > 0
                ? `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`
                : "—"}
            </span>
            {movie.imdb_rating && (
              <>
                <span className="meta-separator">•</span>
                <span className="meta-imdb">
                  <Star size={14} fill="gold" stroke="gold" />
                  {movie.imdb_rating}/10
                </span>
              </>
            )}
          </div>

          {genrePills.length > 0 && (
            <div className="md-hero-genres">
              {genrePills.map((g: string, i: number) => (
                <span key={`${g}-${i}`} className="md-genre-pill">
                  {g}
                </span>
              ))}
            </div>
          )}

          <p className="hero-description">{movie.description}</p>

          {/* Action Buttons */}
          <div className="hero-actions">
            <button type="button" className="btn-play" onClick={handlePlay}>
              <Play size={22} fill="currentColor" strokeWidth={0} />
              <span>{progressPercentage > 5 ? `Resume (${progressPercentage}%)` : "Play"}</span>
            </button>

            <button
              type="button"
              className={`btn-list ${isInMyList ? "active" : ""}`}
              onClick={() => void handleAddToList()}
            >
              {isInMyList ? <Check size={20} strokeWidth={2.5} /> : <Plus size={20} strokeWidth={2.5} />}
              <span>{isInMyList ? "In List" : "My List"}</span>
            </button>

            <button
              type="button"
              className="btn-icon"
              onClick={() => setShowInfo(!showInfo)}
              title="More info"
              aria-label="More info"
            >
              <Info size={20} strokeWidth={2.25} />
            </button>

            {!detailYtId && (
              <button
                type="button"
                className="btn-icon"
                onClick={toggleMute}
                title={isMuted ? "Unmute" : "Mute"}
                aria-label={isMuted ? "Unmute preview" : "Mute preview"}
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            )}
          </div>

          {/* Progress Bar if watching */}
          {progressPercentage > 0 && (
            <div className="hero-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="progress-text">
                <Clock size={12} />
                {Math.floor(progressSeconds / 60)} min watched
              </span>
            </div>
          )}
        </div>

        <div className="hero-fade-bottom" />
      </div>

      {/* Detailed Information Panel */}
      {showInfo && (
        <div className="info-panel">
          <div className="info-panel-overlay" onClick={() => setShowInfo(false)} />
          <div className="info-panel-content">
            <button className="info-close" onClick={() => setShowInfo(false)}>
              <X size={24} />
            </button>
            
            <h2>About {movie.title}</h2>
            
            <div className="info-grid">
              <div className="info-item">
                <label>Genre</label>
                <span>{movie.genre}</span>
              </div>
              <div className="info-item">
                <label>Director</label>
                <span>{movie.director || 'N/A'}</span>
              </div>
              <div className="info-item">
                <label>Writers</label>
                <span>{movie.writers || 'N/A'}</span>
              </div>
              <div className="info-item">
                <label>Audio</label>
                <span>{movie.audio_languages}</span>
              </div>
              <div className="info-item">
                <label>Subtitles</label>
                <span>{movie.subtitle_languages}</span>
              </div>
              <div className="info-item">
                <label>Release Year</label>
                <span>{movie.release_year}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <div className="movie-content">
        {/* Cast Section */}
        {cast.length > 0 && (
          <CastSection cast={cast} />
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <RecommendationsGrid
            recommendations={recommendations}
            currentGenre={movie.genre}
            token={token}
          />
        )}

        {/* Additional Details */}
        <div className="movie-details-section">
          <div className="details-grid">
            <div className="detail-card">
              <h3>About This {movie.type}</h3>
              <p className="detail-description">{movie.description}</p>
              
              <div className="detail-specs">
                <div className="spec-row">
                  <span className="spec-label">Genre:</span>
                  <span className="spec-value">{movie.genre}</span>
                </div>
                {movie.director && (
                  <div className="spec-row">
                    <span className="spec-label">Director:</span>
                    <span className="spec-value">{movie.director}</span>
                  </div>
                )}
                {movie.writers && (
                  <div className="spec-row">
                    <span className="spec-label">Writers:</span>
                    <span className="spec-value">{movie.writers}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="detail-card">
              <h3>Languages & Accessibility</h3>
              <div className="detail-specs">
                <div className="spec-row">
                  <span className="spec-label">Audio:</span>
                  <span className="spec-value">{movie.audio_languages}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-label">Subtitles:</span>
                  <span className="spec-value">{movie.subtitle_languages}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}