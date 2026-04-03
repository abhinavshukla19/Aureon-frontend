import { Suspense } from "react";
import { cookies } from "next/headers";
import { MovieDetailContent } from "./components/movie-detail/movie-detail";
import { ErrorScreen } from "./components/error-screen/error-screen";
import { MovieDetailSkeleton } from "./components/movie-detail-skeliton/movie-detail-skeliton";
import { Host } from "@/components/Global-exports/global-exports";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export type RecommendationMovie = {
  movie_id: string;
  title: string;
  genre: string;
  banner_url: string;
  match_percentage: number;
  description: string;
  duration: number;
  release_year: number;
};

type CastMemberNormalized = {
  actor_name: string;
  character_name: string;
  profile_url: string;
  order?: number;
};

function absMediaUrl(path: string): string {
  const raw = path.trim();
  if (!raw) return "";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  const base = Host.replace(/\/$/, "");
  return `${base}${raw.startsWith("/") ? raw : `/${raw}`}`;
}

async function fetchInMyList(movieId: string, token: string): Promise<boolean> {
  try {
    const res = await fetch(`${Host}/api/mylist/contains/${movieId}`, {
      headers: { Authorization: token },
      cache: "no-store",
    });
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data?.inList);
  } catch {
    return false;
  }
}

function normalizeCastRows(rows: unknown): CastMemberNormalized[] {
  if (!Array.isArray(rows)) return [];
  return rows
    .filter(
      (row): row is Record<string, unknown> =>
        row != null && typeof row === "object"
    )
    .map((row) => ({
      actor_name: String(row.actor_name ?? row.name ?? "Unknown"),
      character_name: String(row.character_name ?? ""),
      profile_url: absMediaUrl(String(row.profile_url ?? "")),
      order: typeof row.order === "number" ? row.order : undefined,
    }));
}

async function fetchRecommendations(
  movieId: string,
  currentGenre: string,
  token: string
): Promise<RecommendationMovie[]> {
  try {
    const res = await fetch(`${Host}/api/movie/get_all_movie`, {
      headers: { Authorization: token },
      next: { revalidate: 120 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const all: Record<string, unknown>[] = Array.isArray(json.data)
      ? json.data
      : [];
    const idNum = Number(movieId);
    const primary =
      (currentGenre || "").split(",")[0]?.trim().toLowerCase() || "";
    const pool = all.filter(
      (m) => m.movie_id != null && Number(m.movie_id) !== idNum
    );

    const scored = pool.map((m, i) => {
      const g = String(m.genre || "").toLowerCase();
      const hit = primary !== "" && g.includes(primary);
      const score = hit ? 92 - (i % 9) : 68 - (i % 11);
      return { m, score: Math.max(52, Math.min(97, score)) };
    });

    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, 12).map(({ m, score }) => ({
      movie_id: String(m.movie_id),
      title: String(m.title ?? "Untitled"),
      genre:
        String(m.genre || "Movie").split(",")[0]?.trim() || "Movie",
      banner_url: absMediaUrl(String(m.banner_url ?? "")),
      match_percentage: score,
      description: String(m.description ?? "").slice(0, 320),
      duration: Number(m.duration) || 0,
      release_year: Number(m.release_year) || 0,
    }));
  } catch {
    return [];
  }
}

async function fetchCompleteMovieData(movieId: string, token: string) {
  try {
    const [movieRes, castRes] = await Promise.allSettled([
      fetch(`${Host}/api/movie/moviedetailbyid/${movieId}`, {
        headers: { Authorization: token },
        next: { revalidate: 300 },
      }),
      fetch(`${Host}/api/cast/get-cast?movie_id=${movieId}`, {
        headers: { Authorization: token },
        next: { revalidate: 600 },
      }),
    ]);

    const movie =
      movieRes.status === "fulfilled" && movieRes.value.ok
        ? (await movieRes.value.json()).data
        : null;

    let castRaw: unknown = [];
    if (castRes.status === "fulfilled" && castRes.value.ok) {
      const body = await castRes.value.json();
      castRaw = body.data ?? [];
    }

    const cast = normalizeCastRows(castRaw);

    const recommendations = movie
      ? await fetchRecommendations(
          movieId,
          String(movie.genre ?? ""),
          token
        )
      : [];

    return { movie, cast, recommendations };
  } catch (error) {
    console.error("Fatal error fetching movie data:", error);
    return { movie: null, cast: [], recommendations: [] };
  }
}

export default async function MovieDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { id: movieId } = await params;
  const sp = (await searchParams) ?? {};

  if (!movieId) {
    return <ErrorScreen message="Invalid movie ID" />;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return <ErrorScreen message="Please sign in to watch movies" showSignIn />;
  }

  const rawResume =
    typeof sp.resumetime === "string"
      ? sp.resumetime
      : Array.isArray(sp.resumetime)
        ? sp.resumetime[0]
        : undefined;
  const resumeNum =
    rawResume != null && rawResume !== "" ? Number(rawResume) : NaN;
  const progress =
    Number.isFinite(resumeNum) && resumeNum > 0
      ? { progress_seconds: resumeNum }
      : null;

  const [{ movie, cast, recommendations }, initialInMyList] =
    await Promise.all([
      fetchCompleteMovieData(movieId, token),
      fetchInMyList(movieId, token),
    ]);

  if (!movie) {
    return <ErrorScreen message="Movie not found" type="404" />;
  }

  return (
    <div className="movie-detail-page-wrapper">
      <Suspense fallback={<MovieDetailSkeleton />}>
        <MovieDetailContent
          movie={movie}
          cast={cast}
          recommendations={recommendations}
          progress={progress}
          token={token}
          initialInMyList={initialInMyList}
        />
      </Suspense>
    </div>
  );
}
