"use client";

import {
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./cast-section.css";

const CAST_IMG_FALLBACK = "/aureon-logo-icon.svg";

type CastMember = {
  actor_name: string;
  character_name: string;
  profile_url: string;
  order?: number;
};

type CastSectionProps = {
  cast: CastMember[];
};

export function CastSection({ cast }: CastSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  /** Mount arrows only after hydrate — avoids SSR/client DOM mismatch */
  const [scrollNavReady, setScrollNavReady] = useState(false);
  useEffect(() => {
    setScrollNavReady(true);
  }, []);

  const checkScrollPosition = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    const max = container.scrollWidth - container.clientWidth;
    const left = container.scrollLeft;
    setCanScrollLeft(left > 4);
    setCanScrollRight(max > 4 && left < max - 4);
  }, []);

  useLayoutEffect(() => {
    checkScrollPosition();
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => checkScrollPosition());
    ro.observe(el);
    window.addEventListener("resize", checkScrollPosition);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", checkScrollPosition);
    };
  }, [cast.length, checkScrollPosition]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.75;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });

    window.setTimeout(checkScrollPosition, 350);
  };

  if (!cast || cast.length === 0) {
    return null;
  }

  return (
    <section className="cast-section">
      <div className="section-header">
        <h2 className="section-title">Cast & Crew</h2>
        {scrollNavReady && cast.length > 3 && (
          <div className="section-nav">
            <button 
              className={`nav-btn ${!canScrollLeft ? 'disabled' : ''}`}
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              className={`nav-btn ${!canScrollRight ? 'disabled' : ''}`}
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      <div 
        ref={scrollRef}
        className="cast-carousel"
        onScroll={checkScrollPosition}
      >
        {cast.map((member, idx) => (
          <div key={idx} className="cast-card">
            <div className="cast-image-container">
              <img
                src={member.profile_url || CAST_IMG_FALLBACK}
                alt={member.actor_name}
                className="cast-image"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  if (!target.src.includes("aureon-logo-icon"))
                    target.src = CAST_IMG_FALLBACK;
                }}
              />
              <div className="cast-overlay" />
            </div>
            <div className="cast-info">
              <h3 className="actor-name" title={member.actor_name}>
                {member.actor_name}
              </h3>
              <p className="character-name" title={member.character_name}>
                {member.character_name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
