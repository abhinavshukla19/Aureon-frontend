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
      headers: { Authorization: token },
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
        headers: { Authorization: token },
      });
      const all = allRes.data?.data;
      if (Array.isArray(all) && all[0]?.movie_id != null) {
        featuredMovieId = Number(all[0].movie_id);
      }
    } catch {
      /* ignore */
    }
  }
  
  const heroMovie = {
    name: "Amnora",
    match: "99%",
    year: "2025",
    rating: "18+",
    audioFormat: "Hindi",
    duration: "120 minutes",
    genres: ["Romance", "Drama", "Action"],
    description: "A story of love, betrayal, action, and redemption.",
    posterUrl: "https://img.englishcinemazurich.com/zJACExqHOItWlEwqUP1s_0M4zr8bhhE0noTCIlBzZOs/resize:fill:800:450:1:0/gravity:sm/aHR0cHM6Ly9leHBhdGNpbmVtYXByb2QuYmxvYi5jb3JlLndpbmRvd3MubmV0L2ltYWdlcy9lYTQ1YzFkNC1mMGYzLTRjZDktODBkNS0wMDc0NWFkNTFmMTcuanBn.jpg",
    videoUrl: "https://www.youtube.com/watch?v=36Jt_145_3o",
  };

  console.log(heroMovie);

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
