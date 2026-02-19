"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Plus, Check, Share2, Info, Clock, Star, X, Volume2, VolumeX } from "lucide-react";
import { MoviePlayer } from "./movie-player";
import { CastSection } from "./cast-section";
import { RecommendationsGrid } from "./recommendation-grid";
import "../style/movie-detail.css";

type MovieDetailContentProps = {
  movie: any;
  cast: any[];
  recommendations: any[];
  progress: any;
};

export function MovieDetailContent({ movie, cast, recommendations, progress }: MovieDetailContentProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInMyList, setIsInMyList] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  // const handleAddToList = async () => {
  //   const result = isInMyList 
  //     ? await removeFromMyList(movie.movie_id)
  //     : await addToMyList(movie.movie_id);
    
  //   if (result.success) {
  //     setIsInMyList(!isInMyList);
  //     notify(result.message);
  //   } else {
  //     notify(result.message, 'error');
  //   }
  // };

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
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Auto-play preview video on mount
  useEffect(() => {
    if (videoRef.current && movie.movie_url) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const progressPercentage = progress 
    ? Math.round((progress.progress_seconds / movie.duration) * 100)
    : 0;

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
          movieId={movie.movie_id}
          resumeTime={progress?.progress_seconds || 0}
          onClose={() => setIsPlaying(false)}
        />
      )}

      {/* Hero Section with Video Background */}
      <div className="movie-hero" ref={heroRef}>
        <div className="movie-hero-background">
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
          <div className="hero-gradient" />
        </div>

        <div className="movie-hero-content">
          <div className="hero-badge">
            {movie.type.toUpperCase()}
          </div>

          <h1 className="hero-title">{movie.title}</h1>
          
          {movie.tagline && (
            <p className="hero-tagline">{movie.tagline}</p>
          )}

          <div className="hero-meta">
            <span className="meta-year">{movie.release_year}</span>
            <span className="meta-separator">•</span>
            <span className="meta-rating">{movie.rating || '16+'}</span>
            <span className="meta-separator">•</span>
            <span className="meta-duration">{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
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

          <p className="hero-description">{movie.description}</p>

          {/* Action Buttons */}
          <div className="hero-actions">
            <button className="btn-play" onClick={handlePlay}>
              <Play size={24} fill="currentColor" />
              <span>{progressPercentage > 5 ? `Resume (${progressPercentage}%)` : 'Play'}</span>
            </button>

            {/* <button 
              className={`btn-list ${isInMyList ? 'active' : ''}`}
              onClick={handleAddToList}
            >
              {isInMyList ? <Check size={20} /> : <Plus size={20} />}
              <span>{isInMyList ? 'In List' : 'My List'}</span>
            </button> */}


            <button className="btn-icon" onClick={() => setShowInfo(!showInfo)} title="More Info">
              <Info size={20} />
            </button>

            <button className="btn-icon" onClick={toggleMute} title={isMuted ? "Unmute" : "Mute"}>
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
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
                {Math.floor(progress.progress_seconds / 60)} min watched
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