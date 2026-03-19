import "./all-movies-tv.css"
import Link from "next/link";
import axios, { AxiosHeaderValue } from "axios";
import { Host } from "../Global-exports/global-exports";
import { ErrorHandler } from "../error-handler/error-handler";

type AllMoviesTVProps = {
  hideHeader?: boolean;
  token: AxiosHeaderValue | undefined;
  limit?: number; // Limit number of movies to show
  showViewMore?: boolean; // Show "View More" link
};

type rowdata = {
  movie_id: number,
  title: string,
  description: string,
  release_year: number,
  duration: number,
  genre: string,
  rating: number,
  banner_url: string,
  movie_url: string,
  audio_languages: string,
  subtitle_languages: string,
  type: string,
  created_at: null
}

export const AllMoviesTV = async ({ hideHeader = false, token, limit, showViewMore = false }: AllMoviesTVProps) => {
  let data = [] as rowdata[];
  let errorMessage: string | null = null;
  
  try {
    const res = await axios.get(`${Host}/api/movie/get_all_movie`, { headers: { token: token } })
    if (res.data && res.data.data) {
      data = res.data.data as rowdata[];
      // Apply limit if specified
      if (limit && limit > 0) {
        data = data.slice(0, limit);
      }
    } else {
      errorMessage = "No movies or TV shows found. The catalog may be empty.";
    }
  } catch (error: any) {
    console.log(error, "Failed to fetch movies and TV shows");
    if (error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND') {
      errorMessage = "Unable to connect to the server. Please check your internet connection.";
    } else if (error?.response?.status === 401) {
      errorMessage = "Your session has expired. Please sign in again to browse content.";
    } else if (error?.response?.status === 500) {
      errorMessage = "Our servers are experiencing issues. Please try again in a few moments.";
    } else if (error?.response?.status === 503) {
      errorMessage = "The service is temporarily unavailable. We're working on fixing it.";
    } else if (error?.message?.includes('timeout')) {
      errorMessage = "The request took too long. Please check your connection and try again.";
    } else if (error?.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else {
      errorMessage = "Failed to load movies and TV shows. Please refresh the page or try again later.";
    }
  }

  // Helper function to format duration
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  // Helper to get primary genre
  const getPrimaryGenre = (genreString: string): string => {
    return genreString.split(',')[0].trim();
  };


  return (
    <section className="movies-section">
      <ErrorHandler error={errorMessage} title="Content Loading Error" />
      
      {!hideHeader && (
        <div className="movies-header">
          <div className="movies-header-content">
            <h2 className="movies-title">Explore Collection</h2>
            <p className="movies-subtitle">Discover movies and shows tailored for you</p>
          </div>
        </div>
      )}

      {data.length === 0 && !errorMessage ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
              <polyline points="2 12 12 17 22 12"/>
            </svg>
          </div>
          <h3 className="empty-title">No Content Available</h3>
          <p className="empty-message">Check back soon for new movies and shows</p>
        </div>
      ) : (
        <>
          <div className="movies-grid">
            {data.map((item, index) => (
              <Link 
                key={item.movie_id} 
                href={`/movie-detail/${item.movie_id}`}
                className="movie-card"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="movie-poster">
                  <img src={item.banner_url} alt={item.title} loading="lazy" />
                  
                  <div className="movie-overlay">
                    <button className="play-btn">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </button>
                  </div>

                  <div className="movie-badges">
                    <span className="type-badge">{item.type}</span>
                    <span className="rating-badge">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                        <path d="M6 1l1.5 3.5L11 5.5l-2.5 2L9 11l-3-2L3 11l.5-3.5L1 5.5l3.5-1L6 1z"/>
                      </svg>
                      {item.rating}
                    </span>
                  </div>
                </div>

                <div className="movie-info">
                  <h3 className="movie-title">{item.title}</h3>
                  <div className="movie-meta">
                    <span className="meta-year">{item.release_year}</span>
                    <span className="meta-dot">•</span>
                    <span className="meta-duration">{formatDuration(item.duration)}</span>
                    <span className="meta-dot">•</span>
                    <span className="meta-genre">{getPrimaryGenre(item.genre)}</span>
                  </div>
                  <p className="movie-description">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
          {showViewMore && (
            <div className="view-more-container">
              <Link href="/newmovie" className="view-more-btn">
                View More
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 4l6 6-6 6"/>
                </svg>
              </Link>
            </div>
          )}
        </>
      )}
    </section>
  );
};