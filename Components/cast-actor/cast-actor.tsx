import "./cast-actor.css"
import axios from "axios";
import { Host } from "../Global-exports/global-exports";


type rowdata={
    movie_id:string;
    actor_name:string;
    actor_img:string;
    character_name:string;
}

export const Cast_actor=async({movie_id}:{movie_id:string})=>{
    let castdata=[] as rowdata[]
    try {
    const res = await axios.get(`${Host}/get-cast`, {
    params: {
      movie_id: movie_id 
    }
    });

    castdata=res.data.data;
        
    } catch (error) {
        console.log(error)
    }

    return(
        <>
        <div className="movie-cast-header">
            <h2 className="movie-cast-title">STARING CAST</h2>
        </div>
        <div className="movie-cast-grid">
            {castdata.map((actor, idx) => (
                <div key={idx} className="movie-cast-item">
                    <div className="movie-cast-image">
                        <img src={actor.actor_img} alt={actor.actor_name} />
                    </div>
                    <p className="movie-cast-name">{actor.actor_name}</p>
                    <p className="movie-cast-character">{actor.character_name}</p>
                </div>
            ))}
        </div>
        </>
    )
}