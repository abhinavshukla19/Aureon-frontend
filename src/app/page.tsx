import { Hero_section } from "../components/Hero-section/herosection";
import { Header } from "../components/header/header";
import { Continue_watching_home } from "../components/continue-watching/cw-home";
import { Topfive } from "../components/topten-movies/topfive";
import { AllMoviesTV } from "../components/all-movies-tv/all-movies-tv";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import axios from "axios";
import { Host } from "@/components/Global-exports/global-exports";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // 🔐 AUTH CHECK ONLY HERE
  if (!token) {
    redirect("/signin");
  }

  let featuredMovieId: number | null = null;
  try {
    const topRes = await axios.get(`${Host}/api/movie/topfivemovies`, {
      headers: { token },
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
        headers: { token },
      });
      const all = allRes.data?.data;
      if (Array.isArray(all) && all[0]?.movie_id != null) {
        featuredMovieId = Number(all[0].movie_id);
      }
    } catch {
      /* ignore */
    }
  }

  return (
    <main style={{ width: "100%", overflowX: "hidden", margin: 0, padding: 0 }}>
      <Header></Header>
      <Hero_section token={token} featuredMovieId={featuredMovieId} />
      <Topfive token={token} />
      <Continue_watching_home token={token} />
      <AllMoviesTV token={token} limit={8} showViewMore={true}></AllMoviesTV>
    </main>
  );
}
