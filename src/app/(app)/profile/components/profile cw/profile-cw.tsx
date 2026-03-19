import axios from "axios";
import "./profile-cw.css";
import { Host } from "@/components/Global-exports/global-exports";
import { cookies } from "next/headers";
import Link from "next/link";

type RowData = {
  movie_id: number;
  title: string;
  banner_url: string;
  progress: number;
  watched_percent: number;
  remaining_time: number;
  episode?: string | null;
};

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
      <p className="pcw-empty">Nothing here yet. Start watching something!</p>
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
                src={movie.banner_url}
                alt={movie.title}
                loading="lazy"
                className="pcw-thumb"
              />
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