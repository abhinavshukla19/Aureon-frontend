"use client";

import Link from "next/link";
import { AddToListIconButton } from "@/components/add-to-list/AddToListIconButton";

export type TopFiveItem = {
  movie_id: number;
  title: string;
  banner_url: string;
  rank_position: number;
};

type Props = {
  item: TopFiveItem;
  token: string;
};

export function TopFiveRankCard({ item, token }: Props) {
  return (
    <Link
      href={`/movie-detail/${item.movie_id}`}
      className="rank-card rank-card--link"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <span className="rank-number">{item.rank_position}</span>

      <div className="rank-poster">
        <img src={item.banner_url} alt={item.title} />
      </div>

      <div className="rank-play-overlay" aria-hidden="false">
        <span className="rank-play-inner">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="rank-play-icon"
          >
            <path
              d="M10 8.5V15.5L16 12L10 8.5Z"
              fill="currentColor"
            />
          </svg>
          <span className="rank-play-text">Play</span>
        </span>
        <AddToListIconButton
          token={token}
          movieId={item.movie_id}
          className="rank-add-list-btn"
          ariaLabel={`Add ${item.title} to My List`}
        />
      </div>
    </Link>
  );
}
