"use client";

import { Recommendation } from "../../Components/recommendation/recomendation"
import { Play, Plus, Share2 } from "lucide-react"
import "./movie-page.css"
import { Cast_actor } from "../../Components/cast-actor/cast-actor";

type rowdata={
    movie_id: string,
    title: string,
    description: string,
    release_year: number,
    duration: number,
    genre: string,
    audio_languages: string,
    subtitle_languages: string,
    type: string,
    // onclick:MouseEventHandler<HTMLButtonElement> | undefined
  }

export const Movie_page=({movie_id , title , release_year , description,type , duration , genre ,audio_languages , subtitle_languages }:rowdata)=>{

    const movie = {
        topTag: "TOP 5 SERIES",
        match: "98% MATCH"
    }

    
    return(
        <>
        <div className="movie-detail-main-div">
            <div className="movie-detail-content-wrapper">
                <div className="movie-detail-left">
                    <div className="movie-header-section">
                        <div className="movie-tags-row">
                            <span className="movie-top-tag">{movie.topTag}</span>
                            <span className="movie-match-tag">{movie.match}</span>
                        </div>
                        <div className="movie-title-row">
                            <h1 className="movie-title">{title}</h1>
                            {/* <span className="movie-season">{movie.season}</span> */}
                        </div>
                        <div className="movie-metadata-row">
                            <span className="movie-metadata-item">{release_year}</span>
                            <span className="movie-metadata-item">16+</span>
                            <span className="movie-metadata-item">{type.toUpperCase()}</span>
                            <span className="movie-metadata-item">{duration} minutes</span>
                            <span className="movie-metadata-item">{genre}</span>
                        </div>
                    </div>

                    <div className="movie-actions-section">
                        <button className="movie-resume-button">
                            <Play size={20} fill="black" />
                            <span>Resume</span>
                        </button>
                        <div className="movie-action-icons">
                            <button className="movie-icon-button">
                                <Plus size={20} />
                            </button>
                            <button className="movie-icon-button">
                                <Share2 size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="movie-synopsis-section">
                        <p className="movie-synopsis">{description}</p>
                    </div>

                    <div className="movie-info-section">
                        <div className="movie-info-item">
                            <span className="movie-info-label">Genres:</span>
                            <div className="movie-info-values">
                                <span className="movie-info-value">{genre}</span>
                            </div>
                        </div>
                        <div className="movie-info-item">
                            <span className="movie-info-label">Audio:</span>
                            <div className="movie-info-values">
                                <span className="movie-info-value">{audio_languages}</span>
                            </div>
                        </div>
                        <div className="movie-info-item">
                            <span className="movie-info-label">Subtitles:</span>
                            <div className="movie-info-values">
                                <span className="movie-info-value">{subtitle_languages}</span>
                            </div>
                        </div>  
                    </div>

                    <div className="movie-cast-section">
                        <Cast_actor movie_id={movie_id} />
                    </div>
                </div>
                <div className="movie-detail-right">
                    <Recommendation />
                </div>
            </div>
        </div>
        </>
    )
}