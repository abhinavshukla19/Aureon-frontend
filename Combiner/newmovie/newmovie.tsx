"use client"
import { useState, useEffect } from 'react';
import './newmovie.css';
import { useRouter } from 'next/navigation';

interface Movie {
  movie_id: number;
  title: string;
  description: string;
  release_year: number;
  duration: number; 
  genre: string; 
  banner_url: string;
  movie_url: string;
  thumbnail:string;
  audio_languages: string;
  subtitle_languages: string;
  type: string;
  created_at: string | null;
  rating: number;
}

export const Newmoviepage= ({moviedata}:any) => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const router=useRouter();

  // Movie data fetch from db
  const movies: Movie[] = moviedata;
  console.log("Movies" , movies)

  // Helper to format duration from minutes to "Xh Ym"
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Helper to get primary genre from comma-separated string
  const getPrimaryGenre = (genreString: string): string => {
    return genreString.split(',')[0].trim();
  };

  // Helper to get all genres as array
  const getGenresArray = (genreString: string): string[] => {
    return genreString.split(',').map(g => g.trim());
  };

  // Get unique categories from all movies
  const categories = ['All', ...Array.from(new Set(
    movies.flatMap(m => getGenresArray(m.genre))
  ))];


  const filteredMovies = movies.filter(movie => {
    const movieGenres = getGenresArray(movie.genre).map(g => g.toLowerCase());
    const matchesCategory = activeCategory === 'all' || movieGenres.includes(activeCategory.toLowerCase());
    // const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory ;
  });

  const featuredMovie = movies[3];
  console.log("featuredMovie" , featuredMovie)
  

  return (
    <div className="movies-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-backdrop">
          <img src={featuredMovie?.thumbnail} alt="hello" />
          <div className="hero-gradient"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-badge">Featured</div>
          <h1 className="hero-title">{featuredMovie.title}</h1>
          <div className="hero-meta">
            <span className="rating">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 1l2.5 6.5L19 8.5l-5.5 4.5L15 20l-5-3.5L5 20l1.5-7L1 8.5l6.5-1L10 1z"/>
              </svg>
              {featuredMovie.rating}
            </span>
            <span>{featuredMovie.release_year}</span>
            <span>{formatDuration(featuredMovie.duration)}</span>
            <span className="genre-badge">{getPrimaryGenre(featuredMovie.genre)}</span>
          </div>
          <p className="hero-description">{featuredMovie.description}</p>
          
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => setSelectedMovie(featuredMovie)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Watch Now
            </button>
            <button className="btn-secondary"> 
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              My List
            </button>
            
          </div>
        </div>

        <div className="scroll-indicator">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
          </svg>
        </div>
      </section>

      {/* Categories */}
      <section className="categories">
        <div className="container">
          <div className="category-tabs">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-tab ${activeCategory === category.toLowerCase() ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.toLowerCase())}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Movie Grid */}
      <section className="movies-grid">
        <div className="container">
          <div className="grid">
            {filteredMovies.map((movie, index) => (
              <div 
                key={movie.movie_id} 
                className="movie-card"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedMovie(movie)}
              >
                <div className="movie-card-inner">
                  <div className="movie-thumbnail">
                    <img src={movie.banner_url} alt={movie.title} />
                    <div className="movie-overlay">
                      <button className="play-button">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                          <path d="M10 8v16l12-8z"/>
                        </svg>
                      </button>
                    </div>
                    <div className="movie-rating">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                        <path d="M7 1l1.5 4L13 6l-3.5 3L11 14l-4-2.5L3 14l1.5-5L1 6l4.5-1L7 1z"/>
                      </svg>
                      {movie.rating}
                    </div>
                  </div>
                  
                  <div className="movie-info">
                    <h3 className="movie-title">{movie.title}</h3>
                    <div className="movie-meta">
                      <span>{movie.release_year}</span>
                      <span className="dot">•</span>
                      <span>{formatDuration(movie.duration)}</span>
                    </div>
                    <div className="movie-genre">{getPrimaryGenre(movie.genre)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
            
      {/* Movie Modal */}
      {selectedMovie && (
        <div className="modal-overlay" onClick={() => setSelectedMovie(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedMovie(null)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
            
            <div className="modal-backdrop">
              <img src={ selectedMovie.thumbnail || selectedMovie.banner_url} alt="" />
              <div className="modal-gradient"></div>
            </div>
            
            <div className="modal-content">
              <h2 className="modal-title">{selectedMovie.title}</h2>
              <div className="modal-meta">
                <span className="modal-rating">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                    <path d="M9 1l2 5.5L17 7.5l-4.5 3.5L14 17l-5-3L4 17l1.5-6L1 7.5l6-1L9 1z"/>
                  </svg>
                  {selectedMovie.rating}
                </span>
                <span>{selectedMovie.release_year}</span>
                <span>{formatDuration(selectedMovie.duration)}</span>
                <span className="modal-genre">{getPrimaryGenre(selectedMovie.genre)}</span>
              </div>
              <p className="modal-description">{selectedMovie.description}</p>
              
              <div className="modal-info-grid">
                <div className="modal-info-item">
                  <span className="modal-info-label">Audio</span>
                  <span className="modal-info-value">{selectedMovie.audio_languages}</span>
                </div>
                <div className="modal-info-item">
                  <span className="modal-info-label">Subtitles</span>
                  <span className="modal-info-value">{selectedMovie.subtitle_languages}</span>
                </div>
                {getGenresArray(selectedMovie.genre).length > 1 && (
                  <div className="modal-info-item">
                    <span className="modal-info-label">Genres</span>
                    <span className="modal-info-value">{selectedMovie.genre}</span>
                  </div>
                )}
              </div>
              
              <div className="modal-actions">
                <button className="btn-primary" onClick={() => router.push(`/movie-detail/${selectedMovie.movie_id}`)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Play
                </button>
                <button className="btn-secondary">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  Add to List
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Decorative Elements */}
      <div className="grain"></div>
    </div>
  );
};