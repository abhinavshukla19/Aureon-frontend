"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "./my-list.css";
import Link from "next/link";
import { Host } from "../Global-exports/global-exports";
import { ErrorHandler } from "../error-handler/error-handler";
import { X, Play, Filter, Grid3x3, List as ListIcon, Calendar, Film, Tv } from "lucide-react";
import { useRouter } from "next/navigation";

type rowdata = {
  movie_id: number;
  title: string;
  description: string;
  release_year: number;
  duration: number;
  genre: string;
  banner_url: string;
  movie_url: string;
  audio_languages: string;
  subtitle_languages: string;
  type: string;
  created_at: string | null;
  added_at?: string;
}

type MyListProps = {
  apiData?: rowdata[];
  token?: string;
}

export const MyList = ({ apiData = [], token }: MyListProps) => {
  const [data, setData] = useState<rowdata[]>(apiData);
  const [filteredData, setFilteredData] = useState<rowdata[]>(apiData);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const router = useRouter();



  // this useState fetches the list 
  useEffect(() => {
    if (apiData.length === 0 && token) {
      fetchMyList();
    } else if (!token && apiData.length === 0) {
      setErrorMessage("Please sign in to view your list.");
    }
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [data, filterType, sortBy]);

  const fetchMyList = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await axios.get(`${Host}/my_list`, {
        headers: { token: token }
      });
      if (res.data && res.data.data) {
        setData(res.data.data as rowdata[]);
      } else {
        setErrorMessage("No items found in your list.");
      }
    } catch (error: any) {
      console.log(error);
      if (error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND') {
        setErrorMessage("Unable to connect to the server. Please check your internet connection.");
      } else if (error?.response?.status === 401) {
        setErrorMessage("Your session has expired. Please sign in again.");
        router.push("/signin");
      } else if (error?.response?.status === 500) {
        setErrorMessage("Our servers are experiencing issues. Please try again in a few moments.");
      } else if (error?.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Failed to load your list. Please refresh the page or try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  // const removeFromList = async (movieId: number) => {
  //   if (!token) {
  //     // For dummy data, just remove from UI without API call
  //     setData(prev => prev.filter(item => item.movie_id !== movieId));
  //     return;
  //   }
    
  //   setRemovingId(movieId);
  //   try {
  //     await axios.delete(`${Host}/my_list/${movieId}`, {
  //       headers: { token: token }
  //     });
  //     setData(prev => prev.filter(item => item.movie_id !== movieId));
  //   } catch (error: any) {
  //     console.error("Failed to remove from list:", error);
  //     if (error?.response?.status === 401) {
  //       setErrorMessage("Your session has expired. Please sign in again.");
  //       router.push("/signin");
  //     } else {
  //       alert("Failed to remove item from your list. Please try again.");
  //     }
  //   } finally {
  //     setRemovingId(null);
  //   }
  // };

  const applyFiltersAndSort = () => {
    let filtered = [...data];

    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter(item => 
        filterType === "movie" ? item.type.toLowerCase() === "movie" : item.type.toLowerCase() === "tv"
      );
    }

    // Apply sort
    switch (sortBy) {
      case "recent":
        filtered.sort((a, b) => {
          const dateA = a.added_at || a.created_at || "";
          const dateB = b.added_at || b.created_at || "";
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        });
        break;
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "year":
        filtered.sort((a, b) => b.release_year - a.release_year);
        break;
      default:
        break;
    }

    setFilteredData(filtered);
  };

  if (loading && data.length === 0) {
    return (
      <section className="my-list-section">
        <div className="my-list-container">
          <div className="my-list-header">
            <div className="my-list-header-content">
              <h1 className="my-list-title">My List</h1>
              <p className="my-list-subtitle">Loading your collection...</p>
            </div>
          </div>
          <div className="my-list-skeleton">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="my-list-skeleton-card">
                <div className="my-list-skeleton-poster"></div>
                <div className="my-list-skeleton-title"></div>
                <div className="my-list-skeleton-meta"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="my-list-section">
      <div className="my-list-container">
        <ErrorHandler error={errorMessage} title="List Loading Error" />
        
        <div className="my-list-header">
          <div className="my-list-header-content">
            <h1 className="my-list-title">My List</h1>
            <p className="my-list-subtitle">
              {data.length === 0 
                ? "Start building your collection" 
                : `${data.length} ${data.length === 1 ? 'item' : 'items'} saved`}
            </p>
          </div>
          
          {data.length > 0 && (
            <div className="my-list-controls">
              <div className="my-list-filters">
                <button
                  className={`my-list-filter-btn ${filterType === "all" ? "active" : ""}`}
                  onClick={() => setFilterType("all")}
                >
                  <Filter size={16} />
                  <span>All</span>
                </button>
                <button
                  className={`my-list-filter-btn ${filterType === "movie" ? "active" : ""}`}
                  onClick={() => setFilterType("movie")}
                >
                  <Film size={16} />
                  <span>Movies</span>
                </button>
                <button
                  className={`my-list-filter-btn ${filterType === "tv" ? "active" : ""}`}
                  onClick={() => setFilterType("tv")}
                >
                  <Tv size={16} />
                  <span>TV Shows</span>
                </button>
              </div>

              <div className="my-list-sort">
                <Calendar size={16} />
                <select
                  className="my-list-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="recent">Recently Added</option>
                  <option value="title">Title (A-Z)</option>
                  <option value="year">Release Year</option>
                </select>
              </div>

              <div className="my-list-view-toggle">
                <button
                  className={`my-list-view-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                >
                  <Grid3x3 size={18} />
                </button>
                <button
                  className={`my-list-view-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                >
                  <ListIcon size={18} />
                </button>
              </div>
            </div>
          )}
        </div>

        {data.length === 0 && !errorMessage ? (
          <div className="my-list-empty">
            <div className="my-list-empty-icon">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                <circle cx="60" cy="60" r="58" stroke="rgba(155, 92, 255, 0.3)" strokeWidth="2" fill="none"/>
                <path d="M40 50L50 60L80 30" stroke="rgba(155, 92, 255, 0.6)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M35 75L45 65L55 75L85 45" stroke="rgba(155, 92, 255, 0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="my-list-empty-title">Your list is empty</h2>
            <p className="my-list-empty-text">
              Start adding movies and TV shows to your list to watch them later.
            </p>
            <Link href="/movies" className="my-list-empty-button">
              <span>Browse Content</span>
            </Link>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="my-list-empty">
            <div className="my-list-empty-icon">
              <Filter size={48} />
            </div>
            <h2 className="my-list-empty-title">No items match your filter</h2>
            <p className="my-list-empty-text">
              Try adjusting your filters to see more results.
            </p>
            <button
              className="my-list-empty-button"
              onClick={() => setFilterType("all")}
            >
              <span>Clear Filters</span>
            </button>
          </div>
        ) : (
          <div className={`my-list-content ${viewMode === "grid" ? "grid-view" : "list-view"}`}>
            {filteredData.map((item, index) => (
              <div 
                key={item.movie_id} 
                // className={`my-list-card ${removingId === item.movie_id ? "removing" : ""}`}
                style={viewMode === "grid" ? { "--index": index, animationDelay: `${index * 0.05}s` } as React.CSSProperties : undefined}
              >
                <Link 
                  href={`/movie-detail/${item.movie_id}`}
                  className="my-list-card-link"
                >
                  <div className="my-list-poster">
                    <img 
                      src={item.banner_url} 
                      alt={item.title}
                      loading="lazy"
                    />
                    <div className="my-list-overlay">
                      <div className="my-list-type-badge">
                        {item.type.toUpperCase()}
                      </div>
                      <div className="my-list-play-button">
                        <Play size={24} fill="white" />
                      </div>
                    </div>
                    <div className="my-list-poster-shine"></div>
                  </div>
                </Link>
                
                <div className="my-list-card-info">
                  <div className="my-list-card-header">
                    <Link 
                      href={`/movie-detail/${item.movie_id}`}
                      className="my-list-card-title"
                    >
                      {item.title}
                    </Link>
                    <button
                      // className={`my-list-remove-btn ${removingId === item.movie_id ? "removing" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // removeFromList(item.movie_id);
                      }}
                      aria-label="Remove from list"
                      // disabled={removingId === item.movie_id}
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <div className="my-list-card-meta">
                    <span className="my-list-year">{item.release_year}</span>
                    <span className="my-list-separator">•</span>
                    <span className="my-list-genre">{item.genre}</span>
                    {item.duration && (
                      <>
                        <span className="my-list-separator">•</span>
                        <span className="my-list-duration">{item.duration} min</span>
                      </>
                    )}
                  </div>
                  {viewMode === "list" && item.description && (
                    <p className="my-list-description">
                      {item.description.length > 150 
                        ? `${item.description.substring(0, 150)}...` 
                        : item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
