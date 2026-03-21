"use client";
import { useState, useMemo, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import "./newmovie.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useMyListToggle } from "@/hooks/useMyListToggle";
import { fetchMyListContains } from "@/lib/mylist-client";

export interface Movie {
  movie_id: number;
  title: string;
  description: string;
  release_year: number;
  duration: number; 
  genre: string; 
  banner_url: string;
  movie_url: string;
  thumbnail_url?: string;
  audio_languages: string;
  subtitle_languages: string;
  type: string;
  created_at: string | null;
  rating?: number;
}

const GRID_GAP_PX = 24;

export const Newmoviepage = ({ moviedata, token }: { moviedata: Movie[]; token: string }) => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [gridColumns, setGridColumns] = useState<number | null>(null);
  const gridMeasureRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { toggle: toggleMyList, isListBusy } = useMyListToggle(token);
  const [featuredInMyList, setFeaturedInMyList] = useState(false);
  const [selectedInMyList, setSelectedInMyList] = useState(false);

  const featuredMovie = useMemo(() => {
    const list = Array.isArray(moviedata) ? moviedata : [];
    return list[0] ?? null;
  }, [moviedata]);

  useEffect(() => {
    if (!featuredMovie || !token) {
      setFeaturedInMyList(false);
      return;
    }
    let cancelled = false;
    void fetchMyListContains(token, featuredMovie.movie_id)
      .then((v) => {
        if (!cancelled) setFeaturedInMyList(v);
      })
      .catch(() => {
        if (!cancelled) setFeaturedInMyList(false);
      });
    return () => {
      cancelled = true;
    };
  }, [featuredMovie?.movie_id, token]);

  useEffect(() => {
    if (!selectedMovie || !token) {
      setSelectedInMyList(false);
      return;
    }
    let cancelled = false;
    void fetchMyListContains(token, selectedMovie.movie_id)
      .then((v) => {
        if (!cancelled) setSelectedInMyList(v);
      })
      .catch(() => {
        if (!cancelled) setSelectedInMyList(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedMovie?.movie_id, token]);

  const movies: Movie[] = Array.isArray(moviedata) ? moviedata : [];

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getPrimaryGenre = (genreString: string): string => {
    return genreString.split(",")[0].trim();
  };

  const getGenresArray = (genreString: string): string[] => {
    return genreString.split(",").map((g) => g.trim()).filter(Boolean);
  };

  /** Case-insensitive unique genres (preserves first-seen label) */
  const categories = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = ["All"];
    for (const m of movies) {
      for (const raw of getGenresArray(m.genre)) {
        const key = raw.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(raw);
      }
    }
    return out;
  }, [movies]);

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const movieGenres = getGenresArray(movie.genre).map((g) => g.toLowerCase());
      return (
        activeCategory === "all" ||
        movieGenres.includes(activeCategory.toLowerCase())
      );
    });
  }, [movies, activeCategory]);

  /**
   * CSS `auto-fit` + `%` can resolve against a wrong width on first paint when
   * `.page-content` is inside a flex column without `min-width: 0` (intrinsic
   * width ≈ one column). We measure the real container and set explicit columns.
   */
  const computeGridColumns = useCallback(() => {
    const el = gridMeasureRef.current;
    if (!el) return;
    const w = el.getBoundingClientRect().width;
    if (w < 8) return;
    const minCard =
      w < 420 ? 148 : w < 560 ? 160 : w < 768 ? 190 : w < 1100 ? 220 : 240;
    const raw = Math.floor((w + GRID_GAP_PX) / (minCard + GRID_GAP_PX));
    const next = Math.min(8, Math.max(1, raw));
    setGridColumns((prev) => (prev === next ? prev : next));
  }, []);

  useLayoutEffect(() => {
    const el = gridMeasureRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    computeGridColumns();
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => computeGridColumns());
    });

    const ro = new ResizeObserver(() => computeGridColumns());
    ro.observe(el);
    window.addEventListener("resize", computeGridColumns);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      ro.disconnect();
      window.removeEventListener("resize", computeGridColumns);
    };
  }, [computeGridColumns, filteredMovies.length]);

  return (
    <div className="movies-page" style={{ minWidth: 0, width: "100%" }}>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-backdrop">
          {featuredMovie?.thumbnail_url && (
            <Image
              src={featuredMovie.thumbnail_url}
              alt={featuredMovie.title || "Featured movie"}
              fill
              priority
              className="hero-backdrop-image"
              style={{ objectFit: "cover" }}
            />
          )}
          <div className="hero-gradient"></div>
        </div>

        <div className="hero-content">
          <div className="hero-badge">Featured</div>
          <h1 className="hero-title">{featuredMovie?.title ?? "Movies"}</h1>
          {featuredMovie ? (
            <>
          <div className="hero-meta">
            <span className="rating">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 1l2.5 6.5L19 8.5l-5.5 4.5L15 20l-5-3.5L5 20l1.5-7L1 8.5l6.5-1L10 1z"/>
              </svg>
              {featuredMovie.rating ?? "—"}
            </span>
            <span>{featuredMovie.release_year}</span>
            <span>{formatDuration(featuredMovie.duration)}</span>
            <span className="genre-badge">{getPrimaryGenre(featuredMovie.genre)}</span>
          </div>
          <p className="hero-description">{featuredMovie.description}</p>
            </>
          ) : (
            <p className="hero-description">Browse the catalog below.</p>
          )}

          <div className="hero-actions">
            <button
              type="button"
              className="btn-primary"
              disabled={!featuredMovie}
              onClick={() => featuredMovie && setSelectedMovie(featuredMovie)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Watch Now
            </button>
            <button
              type="button"
              className={`btn-secondary${featuredInMyList ? " in-my-list" : ""}`}
              disabled={!featuredMovie || isListBusy}
              aria-pressed={featuredInMyList}
              onClick={() =>
                featuredMovie &&
                void toggleMyList(featuredMovie.movie_id, setFeaturedInMyList)
              }
            >
              {featuredInMyList ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              )}
              {featuredInMyList ? "In List" : "My List"}
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
      <section className="categories" aria-label="Filter by genre">
        <div className="container movies-container">
          <div className="category-tabs">
            {categories.map((category) => {
              const id = `genre-${category.toLowerCase().replace(/\s+/g, "-")}`;
              return (
              <button
                type="button"
                key={id}
                className={`category-tab ${activeCategory === category.toLowerCase() ? "active" : ""}`}
                onClick={() => setActiveCategory(category.toLowerCase())}
              >
                {category}
              </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Movie Grid */}
      <section className="movies-grid">
        <div
          className="container movies-container"
          ref={gridMeasureRef}
        >
          <div
            className={`grid${gridColumns != null ? " grid--columns-set" : ""}`}
            style={
              gridColumns != null
                ? {
                    gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
                  }
                : undefined
            }
          >
            {filteredMovies.map((movie, index) => (
              <div 
                key={movie.movie_id} 
                className="movie-card"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setSelectedMovie(movie)}
              >
                <div className="movie-card-inner">
                  <div className="movie-thumbnail">
                    {movie.banner_url && (
                      <Image 
                        src={movie.banner_url} 
                        alt={movie.title}
                        fill
                        loading={index < 12 ? "eager" : "lazy"}
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 280px"
                        className="movie-thumbnail-image"
                        style={{ objectFit: 'cover' }}
                      />
                    )}
                    <div className="movie-overlay">
                      <button type="button" className="play-button" aria-label={`Play ${movie.title}`}>
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                          <path d="M10 8v16l12-8z"/>
                        </svg>
                      </button>
                    </div>
                    <div className="movie-rating">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                        <path d="M7 1l1.5 4L13 6l-3.5 3L11 14l-4-2.5L3 14l1.5-5L1 6l4.5-1L7 1z"/>
                      </svg>
                      {movie.rating ?? "—"}
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
            <button type="button" className="modal-close" onClick={() => setSelectedMovie(null)} aria-label="Close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
            
            <div className="modal-backdrop">
              {(selectedMovie.thumbnail_url || selectedMovie.banner_url) && (
                <Image 
                  src={selectedMovie.thumbnail_url || selectedMovie.banner_url} 
                  alt={selectedMovie.title}
                  fill
                  priority
                  className="modal-backdrop-image"
                  style={{ objectFit: 'cover' }}
                />
              )}
              <div className="modal-gradient"></div>
            </div>
            
            <div className="modal-content">
              <h2 className="modal-title">{selectedMovie.title}</h2>
              <div className="modal-meta">
                <span className="modal-rating">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                    <path d="M9 1l2 5.5L17 7.5l-4.5 3.5L14 17l-5-3L4 17l1.5-6L1 7.5l6-1L9 1z"/>
                  </svg>
                  {selectedMovie.rating ?? "—"}
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
                <button type="button" className="btn-primary" onClick={() => router.push(`/movie-detail/${selectedMovie.movie_id}`)}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Play
                </button>
                <button
                  type="button"
                  className={`btn-secondary${selectedInMyList ? " in-my-list" : ""}`}
                  disabled={isListBusy}
                  aria-pressed={selectedInMyList}
                  onClick={() =>
                    selectedMovie &&
                    void toggleMyList(selectedMovie.movie_id, (inList) => {
                      setSelectedInMyList(inList);
                      if (featuredMovie?.movie_id === selectedMovie.movie_id) {
                        setFeaturedInMyList(inList);
                      }
                    })
                  }
                >
                  {selectedInMyList ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                  )}
                  {selectedInMyList ? "In List" : "Add to List"}
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