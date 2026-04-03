import "./all-movies-tv.css";
import Link from "next/link";
import axios, { AxiosHeaderValue } from "axios";
import { ExploreMovieCard } from "./ExploreMovieCard";
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
    const res = await axios.get(`${Host}/api/movie/get_all_movie`, {
      headers: { Authorization: token }
    });

    if (res.data?.data) {
      data = limit ? res.data.data.slice(0, limit) : res.data.data;
    } else {
      errorMessage = "No movies or TV shows found.";
    }

  } catch (error: any) {
    console.error("Failed to fetch movies:", error);
    errorMessage = error?.response?.data?.message
      || "Failed to load movies. Please refresh the page.";
  }
  
  
return (
    <section className="movies-section">
      <ErrorHandler error={errorMessage} title="Content Loading Error" />
      
      {!hideHeader && (
        <div className="movies-header">
          <div className="movies-header-content">
            <h2 className="movies-title">Explore Collection</h2>
            <p className="movies-subtitle">Discover movies and shows tailored for you</p>
          </div>
          {showViewMore && (
            <Link href="/newmovie" className="movies-header-cta">
              View More
              <span className="movies-header-cta-arrow" aria-hidden>
                →
              </span>
            </Link>
          )}
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
              <ExploreMovieCard
                key={item.movie_id}
                item={item}
                token={String(token ?? "")}
                index={index}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};