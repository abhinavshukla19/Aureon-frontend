import { Hero_section } from "../../Components/Hero-section/herosection";
import { Header } from "../../Combiner/header/header";
import { Continue_watching } from "../../Components/continue-watching/continue-watching";
import { Topfive } from "../../Components/topten-movies/topfive";
import { AllMoviesTV } from "../../Components/all-movies-tv/all-movies-tv";

export default function Home() {
  return (
    <main style={{ width: '100%', overflowX: 'hidden' }}>
      <Header></Header>
      <Hero_section></Hero_section>
      <Continue_watching></Continue_watching>
      <Topfive></Topfive>
      <AllMoviesTV></AllMoviesTV>
    </main>
  );
}
