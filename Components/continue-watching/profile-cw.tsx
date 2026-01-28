import axios, { AxiosHeaderValue } from "axios";
import "./profile-cw.css";
import { Host } from "../Global-exports/global-exports";
import Link from "next/link";

type RowData = {
  movie_id: number;
  title: string;
  banner_url: string;
  progress: number;
  watched_percent: number;
  remaining_time: number;
  episode?: string | null;
  type?: string;
};

type TokenProps = {
  token: AxiosHeaderValue | undefined;
};

export const ProfileContinueWatching = async ({ token }: TokenProps) => {
  let moviesdata: RowData[] = [];

  try {
    const res = await axios.get(`${Host}/continue_watching`, {
      headers: { token },
    });
    moviesdata = res.data.data as RowData[];
  } catch (error: any) {
    console.log(error);
  }

  if (moviesdata.length === 0) {
    return (
      <section className="pcw-section">
        <div className="pcw-empty">
          <div className="pcw-empty-icon">🎬</div>
          <p className="pcw-empty-text">Nothing to continue yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="pcw-section">
      <div className="pcw-list">
        {moviesdata.map((movie) => {
          const progressPercentage = movie.watched_percent;
          const remainingTime = movie.remaining_time;

          return (
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
                    {progressPercentage}%
                  </span>
                  <span className="pcw-progress-remaining">
                    {remainingTime > 0 ? `${remainingTime} left` : "Completed"}
                  </span>
                </div>
              </div>
              <div className="pcw-meta">
                <p className="pcw-title">{movie.title}</p>
                <div className="pcw-meta-row">
                  {movie.episode && (
                    <span className="pcw-episode">{movie.episode}</span>
                  )}
                </div>
                <div className="pcw-bar">
                  <div
                    className="pcw-bar-fill"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

