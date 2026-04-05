import { Hero_section } from "../components/Hero-section/herosection";
import { Header } from "../components/header/header";
import { Continue_watching_home } from "../components/continue-watching/cw-home";
import { Topfive } from "../components/topten-movies/topfive";
import { AllMoviesTV } from "../components/all-movies-tv/all-movies-tv";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import axios from "axios";
import { Host } from "@/components/Global-exports/global-exports";

type HeroMoviePayload = {
  name: string;
  match: string;
  year: string;
  rating: string;
  audioFormat: string;
  duration: string;
  genres: string[];
  description: string;
  posterUrl: string;
  videoUrl: string;
};

function absMediaUrl(path: string): string {
  const raw = path.trim();
  if (!raw) return "";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  const base = Host.replace(/\/$/, "");
  return `${base}${raw.startsWith("/") ? raw : `/${raw}`}`;
}

function mapDetailToHero(m: Record<string, unknown>): HeroMoviePayload {
  const durMin = Number(m.duration) || 0;
  const durationStr =
    durMin > 0 ? `${Math.floor(durMin / 60)}h ${durMin % 60}m` : "";
  const genreStr = String(m.genre ?? "");
  const genres = genreStr
    .split(",")
    .map((g) => g.trim())
    .filter(Boolean);
  const banner = absMediaUrl(String(m.banner_url ?? ""));
  const video = absMediaUrl(String(m.movie_url ?? ""));
  const matchRaw = m.match_percentage;
  const match =
    typeof matchRaw === "number" && Number.isFinite(matchRaw)
      ? String(Math.round(matchRaw))
      : "94";
  const ageBadge =
    m.rating != null && String(m.rating).trim() !== ""
      ? String(m.rating)
      : "16+";
  return {
    name: String(m.title ?? "Featured"),
    match,
    year: String(m.release_year ?? ""),
    rating: "HD",
    audioFormat: ageBadge,
    duration: durationStr,
    genres: genres.length ? genres : ["Movies"],
    description: String(m.description ?? "").slice(0, 500),
    posterUrl: banner || "/aureon-logo-icon.svg",
    videoUrl: video,
  };
}

const emptyHero: HeroMoviePayload = {
  name: "Welcome to Aureon",
  match: "100",
  year: "",
  rating: "HD",
  audioFormat: "—",
  duration: "",
  genres: [],
  description: "Browse movies and TV to start watching.",
  posterUrl: "/aureon-logo-icon.svg",
  videoUrl: "",
};

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/signin");
  }

  const authHeaders = { Authorization: token };

  let featuredMovieId: number | null = null;
  let fallbackListRow: Record<string, unknown> | null = null;

  try {
    const topRes = await axios.get(`${Host}/api/movie/topfivemovies`, {
      headers: authHeaders,
    });
    const top = topRes.data?.data;
    if (Array.isArray(top) && top[0]?.movie_id != null) {
      featuredMovieId = Number(top[0].movie_id);
    }
  } catch {
    /* ignore */
  }

  if (featuredMovieId == null) {
    try {
      const allRes = await axios.get(`${Host}/api/movie/get_all_movie`, {
        headers: authHeaders,
      });
      const all = allRes.data?.data;
      if (Array.isArray(all) && all[0]?.movie_id != null) {
        const row = all[0] as Record<string, unknown>;
        featuredMovieId = Number(row.movie_id);
        fallbackListRow = row;
      }
    } catch {
      /* ignore */
    }
  }

  let heroMovie: HeroMoviePayload = emptyHero;

  if (featuredMovieId != null) {
    try {
      const detailRes = await axios.get(
        `${Host}/api/movie/moviedetailbyid/${featuredMovieId}`,
        { headers: authHeaders }
      );
      const raw = detailRes.data?.data;
      if (raw != null && typeof raw === "object" && !Array.isArray(raw)) {
        heroMovie = mapDetailToHero(raw as Record<string, unknown>);
      } else if (fallbackListRow) {
        heroMovie = mapDetailToHero(fallbackListRow);
      }
    } catch {
      if (fallbackListRow) {
        heroMovie = mapDetailToHero(fallbackListRow);
      }
    }
  }

  return (
    <main style={{ width: "100%", overflowX: "hidden", margin: 0, padding: 0 }}>
      <Header></Header>
      <Hero_section token={token} featuredMovieId={featuredMovieId} heroMovie={heroMovie} />
      <Topfive token={token} />
      <Continue_watching_home token={token} />
      <AllMoviesTV token={token} limit={8} showViewMore={true}></AllMoviesTV>
    </main>
  );
}
