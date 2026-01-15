import { cookies } from "next/headers";
import "./all-movies-tv.css"
import Link from "next/link";
import axios from "axios";
import { Host } from "../Global-exports/global-exports";
import { ErrorHandler } from "../error-handler/error-handler";

type AllMoviesTVProps = {
  hideHeader?: boolean;
};

type rowdata={
     movie_id: number,
    title: string,
    description: string,
    release_year: number,
    duration: number,
    genre: string,
    banner_url: string,
    movie_url: string,
    audio_languages: string,
    subtitle_languages: string,
    type: string,
    created_at: null
  }

export const AllMoviesTV = async ({ hideHeader = false }: AllMoviesTVProps) => {
  let data=[] as rowdata[];
  let errorMessage: string | null = null;
  
    try {
        const cookiestore=await cookies()
        const token=cookiestore.get("token")?.value
        if(!token){
            errorMessage = "Please sign in to browse movies and TV shows.";
        } else {
            const res=await axios.get(`${Host}/get_all_movie`, {headers:{token:token}})
            if (res.data && res.data.data) {
                data=res.data.data as rowdata[];
            } else {
                errorMessage = "No movies or TV shows found. The catalog may be empty.";
            }
        }
    } catch (error: any) {
        console.log(error , "Failed to fetch movies and TV shows");
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


  return (
    <section className="all-movies-tv-section">
      <ErrorHandler error={errorMessage} title="Content Loading Error" />
      {!hideHeader && (
        <div className="all-movies-tv-header">
          <h2 className="all-movies-tv-title">All Movies & TV Shows</h2>
          <p className="all-movies-tv-subtitle">Browse our complete collection</p>
        </div>
      )}

      {data.length === 0 && !errorMessage ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>No movies or TV shows available at the moment.</p>
        </div>
      ) : (
        <div className="all-movies-tv-grid">
          {data.map((item) => (
            <Link 
              key={item.title} 
              href={`/movie-detail/${item.movie_id}`}
              className="all-movies-tv-card"
            >
              <div className="all-movies-tv-poster">
                <img src={item.banner_url} alt={item.title} />
                <div className="all-movies-tv-overlay">
                  <div className="all-movies-tv-type-badge">{item.type}</div>
                  <div className="all-movies-tv-play-icon">▶</div>
                </div>
              </div>
              <div className="all-movies-tv-info">
                <h3 className="all-movies-tv-card-title">{item.title}</h3>
                <div className="all-movies-tv-meta">
                  <span className="all-movies-tv-year">{item.release_year}</span>
                  <span className="all-movies-tv-separator">•</span>
                  <span className="all-movies-tv-genre">{item.genre}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};
