import { Movie_page } from "../../../../Components/movie-main-page/movie-page";
import { Video_player } from "../../../../Components/video-player/movie-preview/video-player";
import "./movie-detail.css"



const Movie_detail=()=>{
    return(
        <>
        <Video_player></Video_player>
        <Movie_page></Movie_page>
        </>
    )
};


export default Movie_detail;