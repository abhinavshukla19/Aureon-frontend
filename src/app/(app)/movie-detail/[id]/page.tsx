import axios from "axios";
import { Movie_page } from "../../../../../Combiner/movie-main-page/movie-page";
import { Video_player } from "../../../../../Components/video-player/movie-preview/video-player";
import "./movie-detail.css";
import { Host } from "../../../../../Components/Global-exports/global-exports";
import { ErrorHandler } from "../../../../../Components/error-handler/error-handler";
import { cookies } from "next/headers";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type rowdata = {
  movie_id: string,
  title: string,
  description: string,
  release_year: number,
  duration: number,
  genre: string,
  banner_url: string,
  movie_url: string,
  audio_languages: string,
  subtitle_languages: string,
  type: string,
  created_at: null
}

const getErrorMessage = (error: any): string => {
  if (error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND') {
    return "Unable to connect to the server. Please check your internet connection or try again later.";
  }
  if (error?.response?.status === 404) {
    return "The movie you're looking for doesn't exist or has been removed.";
  }
  if (error?.response?.status === 500) {
    return "Our servers are experiencing issues. Please try again in a few moments.";
  }
  if (error?.response?.status === 503) {
    return "The service is temporarily unavailable. We're working on fixing it.";
  }
  if (error?.response?.status >= 400 && error?.response?.status < 500) {
    return error?.response?.data?.message || "Invalid request. Please check the movie ID and try again.";
  }
  if (error?.message?.includes('timeout')) {
    return "The request took too long. Please check your connection and try again.";
  }
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  return "Failed to load movie details. Please refresh the page or try again later.";
};

const Movie_detail = async ({ params }: PageProps) => {
  // defining everything 
  let moviedata: rowdata | undefined;
  let errorMessage: string | null = null;
  let movie_id : string | null;
  let token : string | undefined;

  // API call for movie
  try {
    const cookie=await cookies();
    token=cookie.get("token")?.value;
    const param = await params;
    movie_id = param.id;
    
    if (!movie_id ) {
      errorMessage = "Invalid movie ID. Please select a valid movie.";
    } else {
      const res = await axios.get(`${Host}/moviedetailbyid/${movie_id}` , {headers:{token:token}});

      if (!res.data || !res.data.data || !res.data.data[0]) {
        errorMessage ="Movie not found. The movie may have been removed or the ID is incorrect.";
      } else {
        moviedata = res.data.data[0];
      }
    }
  } catch (error: any) {
    console.error("Error loading movie details:", error);
    errorMessage = getErrorMessage(error);
  }


//  API  call on buttonclick for add to list 
  const add_to_list=async()=>{
    try {
    const res=await axios.post("/add-to-mylist" , {"movie_id":movie_id} , {headers:{token:token}})

   } catch (error) {
    console.log("Failed to add to list")
   }
  }
   


  if (errorMessage) {
    return (
      <div className="movie-detail-page">
        <ErrorHandler error={errorMessage} title="Movie Loading Error" />
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '18px', marginBottom: '0.5rem' }}>Please sign in first</p>
          <p style={{ fontSize: '14px', color: '#888' }}>{errorMessage}</p>
        </div>
      </div>
    );
  }


  // if movies data is not found then this UI will run
  if (!moviedata) {
    return (
      <div className="movie-detail-page">
        <ErrorHandler error="Movie not found. The movie may have been removed or the ID is incorrect." title="Movie Not Found" />
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Movie not found</p>
        </div>
      </div>
    );
  }

  // Extract movie_url for Video_player
  const { movie_url } = moviedata;

  return (
    <div className="movie-detail-page">
      <Video_player movie_url={movie_url} />
      <Movie_page {...moviedata} />
    </div>
  );
};

export default Movie_detail;