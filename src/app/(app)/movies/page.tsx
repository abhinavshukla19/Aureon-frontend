import { AllMoviesTV } from "../../../../Components/all-movies-tv/all-movies-tv";
import "./movies.css";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Searchbar } from "../../../../Components/searchbar/searchbar";


const Movies = async() => {
  const cookie=await cookies();
  const token=cookie.get("token")?.value;

  if(!token){
    redirect("/signin")
  }
  
  return (
    <div className="movies-page">
      <div className="movies-page-header">
        <h1 className="movies-page-title">Movies & TV Shows</h1>
        <p className="movies-page-subtitle">Explore our complete collection of movies and TV series</p>
        <Searchbar />
      </div>
      <AllMoviesTV hideHeader={true} token={token} />
    </div>
  );
};

export default Movies;
