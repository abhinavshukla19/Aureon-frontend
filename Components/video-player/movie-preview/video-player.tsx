"use client";
import { useSearchParams } from "next/navigation";
import "./video-player.css"
import { useEffect, useRef } from "react";
import axios from "axios";

type urltype = {
  movie_id: string | null;
  movie_url: string;
};

export const Video_player =({movie_id , movie_url}:urltype) => {

  const searchparams=useSearchParams();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const resumetime=Number(searchparams.get("resumetime") || 0);


//  continue watching timestamp for old user
  useEffect(()=>{
  const video = videoRef.current;
  if (!video) return;

  const onLoaded = () => {
    video.currentTime = resumetime;
  };

  video.addEventListener("loadedmetadata", onLoaded);

  return () => {
    video.removeEventListener("loadedmetadata", onLoaded);
  };
  },[resumetime])


  /* ⏱ Save progress every 5 seconds */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const saveprogress = async() => {
      const progress = Math.floor(video.currentTime);
      await axios.post("/api/cw-player", { movie_id, progress })
      
    };

    const interval = setInterval(saveprogress, 5000);

    return () => clearInterval(interval);
  }, [movie_id]);



  return(
    <>
    <div className="video-player-div">
      <video 
      className="video-player"
      ref={videoRef}
      src={movie_url}
      controls controlsList="nodownload"
       />
    </div>
    </>
 )
};
