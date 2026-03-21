"use client";

import Link from "next/link";
import { AddToListIconButton } from "@/components/add-to-list/AddToListIconButton";

export type ExploreCardMovie = {
  movie_id: number;
  title: string;
  description: string;
  release_year: number;
  duration: number;
  genre: string;
  rating: number;
  banner_url: string;
  movie_url: string;
  type: string;
};

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

function getPrimaryGenre(genreString: string): string {
  return genreString.split(",")[0].trim();
}

type Props = {
  item: ExploreCardMovie;
  token: string;
  index: number;
};

export function ExploreMovieCard({ item, token, index }: Props) {
  return (
    <Link
      href={`/movie-detail/${item.movie_id}`}
      className="movie-card"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="movie-poster">
        <img src={item.banner_url} alt={item.title} loading="lazy" />

        <div className="movie-overlay">
          <div className="movie-overlay-actions">
            <span className="play-btn" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <AddToListIconButton
              token={token}
              movieId={item.movie_id}
              className="movie-add-list-btn"
            />
          </div>
        </div>

        <div className="movie-badges">
          <span className="type-badge">{item.type}</span>
          <span className="rating-badge">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M6 1l1.5 3.5L11 5.5l-2.5 2L9 11l-3-2L3 11l.5-3.5L1 5.5l3.5-1L6 1z" />
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
  );
}
