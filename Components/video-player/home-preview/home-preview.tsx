"use client";

import { useEffect, useRef } from "react";
import "./home-preview.css";
import { Link } from "lucide-react";

export const Home_preview = () => {
  const videoref = useRef<HTMLVideoElement | null>(null);
  const movie="dhurendhaar";

  // Autoplay muted preview
  useEffect(() => {
    if (videoref.current) {
      videoref.current.muted = true;
      videoref.current.play().catch((error) => {console.log(error)});
    }
  }, []);

  // Click → movie detail page
  const openMovie = () => {
    <Link href={`/movie-detail/${movie}`} />
  };

  return (
    <section className="hero-section" onClick={openMovie}>
      <video
        ref={videoref}
        src="/video/Naal_Nachna.mp4"
        muted
        loop
        playsInline
        className="hero-video"
      />

      <div className="hero-play-overlay">▶</div>
      <div className="hero-gradient" />
    </section>
  );
};
