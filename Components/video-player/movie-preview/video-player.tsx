"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";

export const Video_player = () => {
  const videoref = useRef<HTMLVideoElement | null>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);

  // ▶ HERO PREVIEW AUTOPLAY (MUTED)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (videoref.current) {
        videoref.current.muted = true; // REQUIRED for autoplay
        videoref.current.play().catch(() => {
          // autoplay blocked silently (mobile / low power)
        });
        setIsPreviewPlaying(true);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // ▶ USER CLICK → FULL PLAY
  const handlePlayClick = () => {
    if (!videoref.current) return;

    videoref.current.muted = false; // enable sound
    videoref.current.play();
    setIsPreviewPlaying(true);
  };

  return (
    <div className="hero-video-wrapper">
      <video
        ref={videoref}
        src="/video/Stranger_Things_5.mp4"
        className="hero-video"
        loop
        playsInline
        preload="metadata"
      />

      {/* ▶ PLAY OVERLAY */}
      <div className="hero-play-overlay" onClick={handlePlayClick}>
        <div className="hero-play-icon-wrapper">
          <Play size={64} fill="white" strokeWidth={2} />
        </div>
      </div>

      {/* GRADIENT */}
      <div className="hero-gradient-bottom" />
    </div>
  );
};
