"use client";
import "./video-player.css"
import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";

const video_link="/video/Stranger_Things_5.mp4"

export const Video_player = () => {
  const videoref = useRef<HTMLVideoElement | null>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);

  
  return(
    <>
    <div className="video-player-div">
      <video 
      className="video-player"
      src={video_link}
       controls />
    </div>
    </>
 )
};
