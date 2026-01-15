import axios from "axios";
import "./continue-watching.css"
import { Host } from "../Global-exports/global-exports";
import { cookies } from "next/headers";
import Link from "next/link";

type rowdata={
  movie_id: number,
  title: string,
  banner_url: string,
  progress_seconds: number,
  duration_seconds: number,
  episode?: string | null,
  type?: string,
}

const formatTime = (seconds: number): string => {
  if (!seconds || seconds <= 0) return "0:00";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const Continue_watching=async()=>{
  let moviesdata=[] as rowdata[]
   try{
    const cookie = await cookies();
    const token = cookie.get("token")?.value;

    if (!token) {
      return (
        <section className="cw-section">
          <div className="cw-container">
            <h2 className="cw-title">Continue Watching</h2>
            <div className="cw-empty-state">
              <div className="cw-empty-icon">📺</div>
              <p>Please sign in to continue watching your content.</p>
            </div>
          </div>
        </section>
      );
    }

    const res = await axios.get(`${Host}/continue_watching`, {
      headers: { token: token }
    });

    moviesdata=res.data.data as rowdata[]

   }
   catch(error: any){
    console.log(error)
   }

  if (moviesdata.length === 0) {
    return (
      <section className="cw-section">
        <div className="cw-container">
          <h2 className="cw-title">Continue Watching</h2>
          <div className="cw-empty-state">
            <div className="cw-empty-icon">🎬</div>
            <p>You haven't started watching anything yet.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="cw-section">
      <div className="cw-container">
        <div className="cw-header">
          <h2 className="cw-title">Continue Watching</h2>
          <div className="cw-title-accent"></div>
        </div>
        <div className="cw-carousel-wrapper">
          <div className="cw-carousel">
            {moviesdata.map((movie:rowdata) => {
              const progressPercentage = movie.duration_seconds > 0 
                ? (movie.progress_seconds / movie.duration_seconds) * 100 
                : 0;
              const remainingTime = movie.duration_seconds - movie.progress_seconds;
              
              return (
                <Link 
                  key={movie.movie_id} 
                  href={`/movie-detail/${movie.movie_id}`}
                  className="cw-movie-card"
                >
                  <div className="cw-poster-frame">
                    <div className="cw-poster">
                      <img 
                        src={movie.banner_url} 
                        alt={movie.title}
                        loading="lazy"
                      />
                      <div className="cw-poster-shine"></div>
                      <div className="cw-play-indicator">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                          <circle cx="16" cy="16" r="15" stroke="white" strokeWidth="2" fill="rgba(0,0,0,0.6)"/>
                          <path d="M12 10L22 16L12 22V10Z" fill="white"/>
                        </svg>
                      </div>
                    </div>
                    <div className="cw-progress-ring">
                      <svg className="cw-progress-svg" viewBox="0 0 36 36">
                        <defs>
                          <linearGradient id={`cw-gradient-${movie.movie_id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#9b5cff" />
                            <stop offset="50%" stopColor="#c77dff" />
                            <stop offset="100%" stopColor="#e89fff" />
                          </linearGradient>
                        </defs>
                        <circle
                          className="cw-progress-bg"
                          cx="18"
                          cy="18"
                          r="16"
                          fill="none"
                          strokeWidth="2"
                        />
                        <circle
                          className="cw-progress-fill"
                          cx="18"
                          cy="18"
                          r="16"
                          fill="none"
                          strokeWidth="2"
                          stroke={`url(#cw-gradient-${movie.movie_id})`}
                          strokeDasharray={`${progressPercentage}, 100`}
                          transform="rotate(-90 18 18)"
                        />
                      </svg>
                      <div className="cw-progress-text">{Math.round(progressPercentage)}%</div>
                    </div>
                  </div>
                  <div className="cw-card-info">
                    <h3 className="cw-movie-title">{movie.title}</h3>
                    <div className="cw-meta-info">
                      {movie.episode && (
                        <span className="cw-episode-badge">
                          <span className="cw-episode-icon">📺</span>
                          {movie.episode}
                        </span>
                      )}
                      <span className="cw-time-info">
                        {remainingTime > 0 ? `${formatTime(remainingTime)} left` : '✓ Completed'}
                      </span>
                    </div>
                    <div className="cw-resume-bar">
                      <div 
                        className="cw-resume-fill" 
                        style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
