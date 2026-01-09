import { AllMoviesTV } from "../../../../Components/all-movies-tv/all-movies-tv";
import "./movies.css";

const Movies = () => {
  return (
    <div className="movies-page">
      <div className="movies-page-header">
        <h1 className="movies-page-title">Movies & TV Shows</h1>
        <p className="movies-page-subtitle">Explore our complete collection of movies and TV series</p>
      </div>
      <AllMoviesTV hideHeader={true} />
    </div>
  );
};

export default Movies;
