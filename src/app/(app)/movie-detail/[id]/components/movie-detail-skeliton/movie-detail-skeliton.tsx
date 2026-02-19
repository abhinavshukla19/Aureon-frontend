"use client";

import "./movie-detail-skeliton.css";

export function MovieDetailSkeleton() {
  return (
    <div className="skeleton-wrapper">
      {/* Hero Skeleton */}
      <div className="skeleton-hero">
        <div className="skeleton-hero-content">
          <div className="skeleton-badge" />
          <div className="skeleton-title" />
          <div className="skeleton-meta" />
          <div className="skeleton-description" />
          <div className="skeleton-description short" />
          <div className="skeleton-actions">
            <div className="skeleton-btn large" />
            <div className="skeleton-btn" />
            <div className="skeleton-icon" />
            <div className="skeleton-icon" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="skeleton-content">
        {/* Cast Skeleton */}
        <div className="skeleton-section">
          <div className="skeleton-section-title" />
          <div className="skeleton-cast-grid">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="skeleton-cast-card">
                <div className="skeleton-cast-image" />
                <div className="skeleton-cast-name" />
                <div className="skeleton-cast-character" />
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations Skeleton */}
        <div className="skeleton-section">
          <div className="skeleton-section-title" />
          <div className="skeleton-recommendations-grid">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton-recommendation-card">
                <div className="skeleton-recommendation-poster" />
                <div className="skeleton-recommendation-content">
                  <div className="skeleton-recommendation-title" />
                  <div className="skeleton-recommendation-meta" />
                  <div className="skeleton-recommendation-desc" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
