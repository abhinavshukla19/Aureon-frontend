import "./cast-actor.css"



export const Cast_actor=()=>{

    const cast = [
        { name: "Millie Bobby Brown", character: "Eleven", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" },
        { name: "Finn Wolfhard", character: "Mike Wheeler", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
        { name: "Gaten Matarazzo", character: "Dustin Henderson", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" },
        { name: "Sadie Sink", character: "Max Mayfield", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop" },
        { name: "Joe Keery", character: "Steve Harrington", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop" }
    ]

    return(
        <>
        <div className="movie-cast-header">
            <h2 className="movie-cast-title">STARING CAST</h2>
        </div>
        <div className="movie-cast-grid">
            {cast.map((actor, idx) => (
                <div key={idx} className="movie-cast-item">
                    <div className="movie-cast-image">
                        <img src={actor.image} alt={actor.name} />
                    </div>
                    <p className="movie-cast-name">{actor.name}</p>
                    <p className="movie-cast-character">{actor.character}</p>
                </div>
            ))}
        </div>
        </>
    )
}