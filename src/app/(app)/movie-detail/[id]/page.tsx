import { Movie_page } from "../../../../../Components/movie-main-page/movie-page";
import { Video_player } from "../../../../../Components/video-player/movie-preview/video-player";
import "./movie-detail.css"

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};


const Movie_detail=async({params}:PageProps)=>{
    const param=await params
    

    return(
        <div className="movie-detail-page">
        <Video_player></Video_player>
        <Movie_page></Movie_page>
        </div>
    )
};


export default Movie_detail;