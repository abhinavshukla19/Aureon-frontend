"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./cast-section.css";

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
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    checkScrollPosition();
  }, []);

  const checkScrollPosition = () => {
    const container = scrollRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
    
    // Check scroll position after animation
    setTimeout(checkScrollPosition, 300);
  };

  if (!cast || cast.length === 0) {
    return null;
  }

  return (
    <section className="cast-section">
      <div className="section-header">
        <h2 className="section-title">Cast & Crew</h2>
        {cast.length > 5 && (
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
                src={member.profile_url || '/placeholder-actor.jpg'}
                alt={member.actor_name}
                className="cast-image"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-actor.jpg';
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
