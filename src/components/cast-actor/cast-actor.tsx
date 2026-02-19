"use client";

import "./cast-actor.css";

type CastData = {
  actor_name: string;
  character_name: string;
  profile_url: string;
};

type CastActorProps = {
  castData: CastData[];
};

export const Cast_actor = ({ castData }: CastActorProps) => {
  if (!castData || castData.length === 0) {
    return (
      <div className="movie-cast-empty">
        <p>No cast information available</p>
      </div>
    );
  }

  return (
    <>
      <div className="movie-cast-header">
        <h2 className="movie-cast-title">STARRING CAST</h2>
      </div>
      <div className="movie-cast-grid">
        {castData.map((actor, idx) => (
          <div key={idx} className="movie-cast-item">
            <div className="movie-cast-image">
              <img 
                src={actor.profile_url || '/placeholder-actor.jpg'} 
                alt={actor.actor_name}
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-actor.jpg';
                }}
              />
            </div>
            <p className="movie-cast-name">{actor.actor_name}</p>
            <p className="movie-cast-character">{actor.character_name}</p>
          </div>
        ))}
      </div>
    </>
  );
};