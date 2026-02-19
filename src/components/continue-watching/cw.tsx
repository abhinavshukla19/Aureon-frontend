import axios, { AxiosHeaderValue } from "axios";
import "./cw.css"
import { Host } from "../Global-exports/global-exports";
import Link from "next/link";

type rowdata = {
  movie_id: number, 
  title: string,
  thumbnail_url: string,
  progress: number,
  watched_percent: number,
  remaining_time: number,
  episode?: string | null,
}

type tokentype = {
  token: AxiosHeaderValue | undefined;
}

export const Continue_watching = async ({ token }: tokentype) => {
  let moviesdata = [] as rowdata[]

  try {
    const res = await axios.get(`${Host}/continue_watching`, {
      headers: { token: token }
    });
    moviesdata = res.data.data as rowdata[];
  } catch (error: any) {
    console.log(error)
  }

  // Helper to format remaining time
  const formatTime = (minutes: number): string => {
    if (minutes < 1) return "Few seconds";
    if (minutes < 60) return `${Math.round(minutes)}m left`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return mins > 0 ? `${hours}h ${mins}m left` : `${hours}h left`;
  };

  if (moviesdata.length === 0) {
    return null;
  }

  return (
    <section className="continue-section">
      <div className="continue-container">
        <div className="continue-header">
          <div className="header-left">
            <h2 className="continue-title">Continue Watching</h2>
            <p className="continue-subtitle">Pick up where you left off</p>
          </div>
          <Link href="/movies" className="view-all-btn">
              View All
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 4l4 4-4 4"/>
              </svg>
          </Link>
        </div>

        <div className="continue-carousel">
          <div className="carousel-track">
            {moviesdata.map((movie: rowdata, index: number) => {
              const progressPercentage = movie.watched_percent;
              const isCompleted = progressPercentage >= 98;
              
              return (
                <Link 
                  key={movie.movie_id} 
                  href={`/movie-detail/${movie.movie_id}?resumetime=${movie.progress}`}
                  className="continue-card"
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <div className="continue-poster">
                    <img 
                      src={movie.thumbnail_url} 
                      alt={movie.title}
                      loading="lazy"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="poster-overlay"></div>
                    
                    {/* Play Button */}
                    <div className="play-overlay">
                      <div className="play-button">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>

                    {/* Circular Progress */}
                    <div className="circular-progress">
                      <svg className="progress-ring" width="56" height="56" viewBox="0 0 56 56">
                        <circle
                          className="progress-ring-bg"
                          cx="28"
                          cy="28"
                          r="24"
                          fill="none"
                          strokeWidth="4"
                        />
                        <circle
                          className="progress-ring-circle"
                          cx="28"
                          cy="28"
                          r="24"
                          fill="none"
                          strokeWidth="4"
                          strokeDasharray={`${progressPercentage * 1.508}, 150.8`}
                          transform="rotate(-90 28 28)"
                        />
                      </svg>
                      <div className="progress-percent">
                        {isCompleted ? (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M6 12l4 4 8-8"/>
                          </svg>
                        ) : (
                          <span>{progressPercentage}%</span>
                        )}
                      </div>
                    </div>

                    {/* Episode Badge */}
                    {movie.episode && (
                      <div className="episode-badge">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="7" width="20" height="15" rx="2"/>
                          <polyline points="17 2 12 7 7 2"/>
                        </svg>
                        {movie.episode}
                      </div>
                    )}
                  </div>

                  <div className="continue-info">
                    <h3 className="continue-card-title">{movie.title}</h3>
                    
                    <div className="continue-meta">
                      {isCompleted ? (
                        <span className="completed-badge">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                            <circle cx="7" cy="7" r="7"/>
                            <path d="M4 7l2 2 4-4" stroke="white" strokeWidth="1.5" fill="none"/>
                          </svg>
                          Completed
                        </span>
                      ) : (
                        <span className="time-left">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="7" cy="7" r="6"/>
                            <path d="M7 3v4l3 2"/>
                          </svg>
                          {formatTime(movie.remaining_time)}
                        </span>
                      )}
                    </div>

                    {/* Linear Progress Bar */}
                    <div className="linear-progress">
                      <div className="progress-track">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${progressPercentage}%` }}
                        >
                          <div className="progress-shine"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button className="carousel-nav nav-left">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <button className="carousel-nav nav-right">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>

        {/* Scroll Fade Overlays */}
        <div className="scroll-fade fade-left"></div>
        <div className="scroll-fade fade-right"></div>
      </div>
    </section>
  )
}