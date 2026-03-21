import axios from "axios";
import "./profile-cw.css";
import { Host } from "@/components/Global-exports/global-exports";
import { cookies } from "next/headers";
import Link from "next/link";

type RowData = {
  movie_id: number;
  title: string;
  banner_url?: string | null;
  progress: number;
  watched_percent: number;
  remaining_time: number;
  episode?: string | null;
};

function resolvePoster(url: string | null | undefined) {
  const trimmed = url?.trim() ?? "";
  if (!trimmed) return "/aureon-logo-icon.svg";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  const base = Host.replace(/\/$/, "");
  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${base}${path}`;
}

export const ProfileContinueWatching = async () => {
  let moviesdata: RowData[] = [];

  try {
    const cookie = await cookies();
    const token = cookie.get("token")?.value;

    if (!token) return null;

    const res = await axios.get(`${Host}/api/movie/continue_watching`, {
      headers: { token },
    });

    moviesdata = res.data.data as RowData[];

  } catch (error: any) {
    console.error("Continue watching error:", error);
  }

  if (moviesdata.length === 0) {
    return (
      <div className="pcw-empty" role="status">
        <span className="pcw-empty-glow" aria-hidden />
        <p className="pcw-empty-text">
          Nothing here yet — start something new and we&apos;ll save your spot.
        </p>
      </div>
    );
  }

  return (
    <section className="pcw-section">
      <div className="pcw-list">
        {moviesdata.map((movie) => (
          <Link
            key={movie.movie_id}
            href={`/movie-detail/${movie.movie_id}?resumetime=${movie.progress}`}
            className="pcw-item"
          >
            <div className="pcw-thumb-wrap">
              <img
                src={resolvePoster(movie.banner_url)}
                alt={movie.title}
                loading="lazy"
                className="pcw-thumb"
              />
              <div className="pcw-play-overlay" aria-hidden>
                <span className="pcw-play-icon">▶</span>
              </div>
              <div className="pcw-progress-pill">
                <span className="pcw-progress-value">
                  {movie.watched_percent}%
                </span>
                <span className="pcw-progress-remaining">
                  {movie.remaining_time > 0
                    ? `${movie.remaining_time} left`
                    : "Completed"}
                </span>
              </div>
            </div>
            <div className="pcw-meta">
              <p className="pcw-title">{movie.title}</p>
              {movie.episode && (
                <span className="pcw-episode">{movie.episode}</span>
              )}
              <div className="pcw-bar">
                <div
                  className="pcw-bar-fill"
                  style={{ width: `${movie.watched_percent}%` }}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};