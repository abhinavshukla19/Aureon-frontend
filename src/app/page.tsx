import { Hero_section } from "../components/Hero-section/herosection";
import { Header } from "../components/header/header";
import { Continue_watching_home } from "../components/continue-watching/cw-home";
import { Topfive } from "../components/topten-movies/topfive";
import { AllMoviesTV } from "../components/all-movies-tv/all-movies-tv";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // 🔐 AUTH CHECK ONLY HERE
  if (!token) {
    redirect("/signin");
  }

  return (
    <main style={{ width: "100%", overflowX: "hidden", margin: 0, padding: 0 }}>
      <Header></Header>
      <Hero_section></Hero_section>
      <Topfive token={token} />
      <Continue_watching_home token={token} />
      <AllMoviesTV token={token} limit={8} showViewMore={true}></AllMoviesTV>
    </main>
  );
}
