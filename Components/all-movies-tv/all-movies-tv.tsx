import { cookies } from "next/headers";
import "./all-movies-tv.css"
import Link from "next/link";
import axios from "axios";
import { Host } from "../Global-exports/global-exports";

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
    try {
        const cookiestore=await cookies()
        const token=cookiestore.get("token")?.value
        if(!token){
            throw new Error("Unauthorized")
        }
        const res=await axios.get(`${Host}/get_all_movie`, {headers:{token:token}})
        data=res.data.data as rowdata[]  
        console.log(data)
    } catch (error) {
        console.log(error , "Failed to fetch movies and TV shows")
    }


  return (
    <section className="all-movies-tv-section">
      {!hideHeader && (
        <div className="all-movies-tv-header">
          <h2 className="all-movies-tv-title">All Movies & TV Shows</h2>
          <p className="all-movies-tv-subtitle">Browse our complete collection</p>
        </div>
      )}

      <div className="all-movies-tv-grid">
        {data.map((item) => (
          <Link 
            key={item.title} 
            href={`/movie-detail/${item.title}`}
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
    </section>
  );
};
