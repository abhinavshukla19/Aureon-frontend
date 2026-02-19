"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Plus, Info } from "lucide-react";
import "./recommendation-grid.css";

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
};

export function RecommendationsGrid({ recommendations, currentGenre }: RecommendationsGridProps) {
  
  const router = useRouter();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleNavigate = (movieId: string) => {
    router.push(`/movie/${movieId}`);
  };

  // Group by match percentage
  const topMatches = recommendations.filter(r => r.match_percentage >= 80);
  const goodMatches = recommendations.filter(r => r.match_percentage < 80 && r.match_percentage >= 60);
  const otherMatches = recommendations.filter(r => r.match_percentage < 60);
  console.log("ramu",topMatches,goodMatches,otherMatches)

  const renderSection = (title: string, movies: RecommendationMovie[]) => {
    if (movies.length === 0) return null;

    return (
      <div className="recommendation-section">
        <h3 className="recommendation-section-title">{title}</h3>
        <div className="recommendations-grid">
          {movies.map((movie) => (
            <div
              key={movie.movie_id}
              className={`recommendation-card ${hoveredId === movie.movie_id ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredId(movie.movie_id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="recommendation-poster">
                <img
                  src={movie.banner_url || '/placeholder-movie.jpg'}
                  alt={movie.title}
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-movie.jpg';
                  }}
                />
                <div className="recommendation-overlay">
                  <button 
                    className="overlay-btn play-btn"
                    onClick={() => handleNavigate(movie.movie_id)}
                  >
                    <Play size={20} fill="currentColor" />
                  </button>
                  <button className="overlay-btn add-btn">
                    <Plus size={20} />
                  </button>
                  <button 
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
                  <span className="meta-item">{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
                  <span className="meta-separator">•</span>
                  <span className="meta-item">{movie.genre}</span>
                </div>
                <p className="recommendation-description">
                  {movie.description.length > 120
                    ? `${movie.description.substring(0, 120)}...`
                    : movie.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="recommendations-container">
      <div className="section-header">
        <h2 className="section-title">More Like This</h2>
        <p className="section-subtitle">Based on "{currentGenre}"</p>
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
