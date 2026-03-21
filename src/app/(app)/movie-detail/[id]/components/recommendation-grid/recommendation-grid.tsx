"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Info } from "lucide-react";
import { AddToListIconButton } from "@/components/add-to-list/AddToListIconButton";
import "./recommendation-grid.css";

const POSTER_FALLBACK = "/aureon-logo-icon.svg";

type RecommendationMovie = {
  movie_id: string;
  title: string;
  genre: string;
  banner_url: string;
  match_percentage: number;
  description: string;
  duration: number;
  release_year: number;
};

type RecommendationsGridProps = {
  recommendations: RecommendationMovie[];
  currentGenre: string;
  token: string;
};

export function RecommendationsGrid({
  recommendations,
  currentGenre,
  token,
}: RecommendationsGridProps) {
  const router = useRouter();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleNavigate = (movieId: string) => {
    router.push(`/movie-detail/${movieId}`);
  };

  const topMatches = recommendations.filter((r) => r.match_percentage >= 80);
  const goodMatches = recommendations.filter(
    (r) => r.match_percentage < 80 && r.match_percentage >= 60
  );
  const otherMatches = recommendations.filter((r) => r.match_percentage < 60);

  const renderSection = (title: string, movies: RecommendationMovie[]) => {
    if (movies.length === 0) return null;

    return (
      <div className="recommendation-section">
        <h3 className="recommendation-section-title">{title}</h3>
        <div className="recommendations-grid">
          {movies.map((movie) => {
            const numericId = Number(movie.movie_id);
            return (
              <div
                key={movie.movie_id}
                className={`recommendation-card ${hoveredId === movie.movie_id ? "hovered" : ""}`}
                onMouseEnter={() => setHoveredId(movie.movie_id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="recommendation-poster">
                  <img
                    src={movie.banner_url?.trim() ? movie.banner_url : POSTER_FALLBACK}
                    alt={movie.title}
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      if (!target.src.includes("aureon-logo-icon"))
                        target.src = POSTER_FALLBACK;
                    }}
                  />
                  <div className="recommendation-overlay">
                    <button
                      type="button"
                      className="overlay-btn play-btn"
                      onClick={() => handleNavigate(movie.movie_id)}
                    >
                      <Play size={20} fill="currentColor" />
                    </button>
                    {!Number.isNaN(numericId) && (
                      <AddToListIconButton
                        token={token}
                        movieId={numericId}
                        className="overlay-btn add-btn"
                        ariaLabel={`Add ${movie.title} to My List`}
                      />
                    )}
                    <button
                      type="button"
                      className="overlay-btn info-btn"
                      onClick={() => handleNavigate(movie.movie_id)}
                    >
                      <Info size={20} />
                    </button>
                  </div>
                  <div className="match-badge">{movie.match_percentage}% Match</div>
                </div>

                <div className="recommendation-details">
                  <h4 className="recommendation-title">{movie.title}</h4>
                  <div className="recommendation-meta">
                    <span className="meta-item">{movie.release_year}</span>
                    <span className="meta-separator">•</span>
                    <span className="meta-item">
                      {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                    </span>
                    <span className="meta-separator">•</span>
                    <span className="meta-item">{movie.genre}</span>
                  </div>
                  <p className="recommendation-description">
                    {(movie.description || "").length > 120
                      ? `${(movie.description || "").substring(0, 120)}...`
                      : movie.description || " "}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <section className="recommendations-container">
      <div className="section-header">
        <h2 className="section-title">More Like This</h2>
        <p className="section-subtitle">Based on &quot;{currentGenre}&quot;</p>
      </div>

      {renderSection("Top Picks For You", topMatches)}
      {renderSection("You Might Also Like", goodMatches)}
      {renderSection("More To Explore", otherMatches)}

      {recommendations.length === 0 && (
        <div className="recommendations-empty">
          <p>No recommendations available at the moment</p>
        </div>
      )}
    </section>
  );
}
