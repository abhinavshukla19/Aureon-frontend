"use client";
import "./video-player.css"

type urltype={
  movie_url:string
}
export const Video_player = ({movie_url}:urltype) => {

  
  return(
    <>
    <div className="video-player-div">
      <video 
      className="video-player"
      src={movie_url}
       controls 
       />
    </div>
    </>
 )
};
