"use client";

import { Recommendation } from "../recommendation/recomendation"
import { Play, Plus, ThumbsUp, Share2 } from "lucide-react"
import "./movie-page.css"


export const Movie_page=()=>{

    const movie = {
        name: "STRANGER THINGS",
        season: "Season 5",
        topTag: "TOP 5 SERIES",
        match: "98% MATCH",
        year: "2025",
        rating: "16+",
        episodes: "9 Episodes",
        quality: "4K ULTRA HD",
        imdb: "IMDb",
        resumeText: "Resume S5:E1",
        desc: "Darkness returns to Hawkins just in time for spring break, sparking fresh terror, disturbing memories — and the threat of war. As the crew navigates high school social dynamics and new threats, they must band together to solve a gruesome mystery that could finally put an end to the Upside Down.",
        genres: ["Sci-Fi TV", "Horror Series", "Teen TV Shows"],
        audio: ["English (Original)", "Spanish", "French", "German"],
        subtitles: ["English", "Spanish", "French", "Simplified Chinese"]
    }

    const cast = [
        { name: "Millie Bobby Brown", character: "Eleven", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" },
        { name: "Finn Wolfhard", character: "Mike Wheeler", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" },
        { name: "Gaten Matarazzo", character: "Dustin Henderson", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop" },
        { name: "Sadie Sink", character: "Max Mayfield", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop" },
        { name: "Joe Keery", character: "Steve Harrington", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop" }
    ]
    
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
                            <h1 className="movie-title">{movie.name}</h1>
                            <span className="movie-season">{movie.season}</span>
                        </div>
                        <div className="movie-metadata-row">
                            <span className="movie-metadata-item">{movie.year}</span>
                            <span className="movie-metadata-item">{movie.rating}</span>
                            <span className="movie-metadata-item">{movie.episodes}</span>
                            <span className="movie-metadata-item">{movie.quality}</span>
                            <span className="movie-metadata-item">{movie.imdb}</span>
                        </div>
                    </div>

                    <div className="movie-actions-section">
                        <button className="movie-resume-button">
                            <Play size={20} fill="black" />
                            <span>{movie.resumeText}</span>
                        </button>
                        <div className="movie-action-icons">
                            <button className="movie-icon-button">
                                <Plus size={20} />
                            </button>
                            <button className="movie-icon-button">
                                <ThumbsUp size={20} />
                            </button>
                            <button className="movie-icon-button">
                                <Share2 size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="movie-synopsis-section">
                        <p className="movie-synopsis">{movie.desc}</p>
                    </div>

                    <div className="movie-info-section">
                        <div className="movie-info-item">
                            <span className="movie-info-label">Genres:</span>
                            <div className="movie-info-values">
                                {movie.genres.map((genre, idx) => (
                                    <span key={idx} className="movie-info-value">{genre}</span>
                                ))}
                            </div>
                        </div>
                        <div className="movie-info-item">
                            <span className="movie-info-label">Audio:</span>
                            <div className="movie-info-values">
                                {movie.audio.map((lang, idx) => (
                                    <span key={idx} className="movie-info-value">{lang}{idx < movie.audio.length - 1 ? "," : ""}</span>
                                ))}
                            </div>
                        </div>
                        <div className="movie-info-item">
                            <span className="movie-info-label">Subtitles:</span>
                            <div className="movie-info-values">
                                {movie.subtitles.map((lang, idx) => (
                                    <span key={idx} className="movie-info-value">{lang}{idx < movie.subtitles.length - 1 ? "," : ""}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="movie-cast-section">
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
                    </div>
                </div>
                <div className="movie-detail-right">
                    <Recommendation></Recommendation>
                </div>
            </div>
        </div>
        </>
    )
}