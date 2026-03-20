import axios, { AxiosHeaderValue } from "axios";
import "./cw-home.css";
import { Host } from "../Global-exports/global-exports";
import Link from "next/link";

type RowData = {
  movie_id: number;
  title: string;
  thumbnail_url: string;
  progress: number;
  watched_percent: number;
  remaining_time: number;
  episode?: string | null;
};

type TokenType = {
  token: AxiosHeaderValue | undefined;
};

const clampPct = (pct: number) => Math.max(0, Math.min(100, pct));

const formatRemainingTime = (minutes: number): string => {
  if (minutes < 1) return "Few seconds";
  if (minutes < 60) return `${Math.round(minutes)}m left`;
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return mins > 0 ? `${hours}h ${mins}m left` : `${hours}h left`;
};

export const Continue_watching_home = async ({ token }: TokenType) => {
  let moviesdata: RowData[] = [];

  try {
    const res = await axios.get(`${Host}/api/movie/continue_watching`, {
      headers: { token },
    });
    moviesdata = res.data.data as RowData[];
  } catch (err) {
    console.error("Continue watching error:", err);
  }

  if (moviesdata.length === 0) {
    return (
      <section className="cw-home-section">
        <div className="cw-home-inner">
          <div className="cw-home-head">
            <div>
              <h2 className="cw-home-title">Continue Watching</h2>
              <p className="cw-home-subtitle">Pick up right where you left off</p>
            </div>
            <Link href="/movies" className="cw-home-view-all">
              View All
              <span aria-hidden className="cw-home-view-all-arrow">
                →
              </span>
            </Link>
          </div>

          <div className="cw-home-empty">
            <div className="cw-home-empty-card">
              <p className="cw-home-empty-text">
                Nothing here yet. Start watching something!
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="cw-home-section">
      <div className="cw-home-inner">
        <div className="cw-home-head">
          <div>
            <h2 className="cw-home-title">Continue Watching</h2>
            <p className="cw-home-subtitle">Pick up right where you left off</p>
          </div>
          <Link href="/movies" className="cw-home-view-all">
            View All
            <span aria-hidden className="cw-home-view-all-arrow">→</span>
          </Link>
        </div>

        <div className="cw-home-list">
          {moviesdata.slice(0, 6).map((movie, idx) => {
            const pct = clampPct(movie.watched_percent);
            const isCompleted = pct >= 98;

            return (
              <Link
                key={movie.movie_id}
                href={`/movie-detail/${movie.movie_id}?resumetime=${movie.progress}`}
                className="cw-home-row"
                style={{ animationDelay: `${idx * 60}ms` }}
                aria-label={`Continue watching ${movie.title}`}
              >
                <div className="cw-home-thumb">
                  <img src={movie.thumbnail_url} alt={movie.title} loading="lazy" />
                  <div className="cw-home-play-pill" aria-hidden>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M8 5v14l11-7z" fill="currentColor" />
                    </svg>
                  </div>
                </div>

                <div className="cw-home-meta">
                  <div className="cw-home-meta-top">
                    <h3 className="cw-home-title-row">{movie.title}</h3>
                    {movie.episode ? (
                      <span className="cw-home-episode">{movie.episode}</span>
                    ) : null}
                  </div>

                  <div className="cw-home-progress">
                    <div className="cw-home-bar" aria-hidden>
                      <div className="cw-home-bar-fill" style={{ width: `${pct}%` }} />
                    </div>

                    <div className="cw-home-progress-bottom">
                      <span className="cw-home-progress-text">
                        {isCompleted
                          ? "Completed"
                          : formatRemainingTime(movie.remaining_time)}
                      </span>
                      <span className="cw-home-progress-pct">{pct}%</span>
                    </div>
                  </div>
                </div>

                <div className="cw-home-chevron" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

