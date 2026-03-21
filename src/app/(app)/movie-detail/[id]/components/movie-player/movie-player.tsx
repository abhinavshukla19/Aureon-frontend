"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipForward,
  SkipBack,
  X,
} from "lucide-react";
import "./movie-player.css";

type MoviePlayerProps = {
  movieUrl: string;
  movieId: string;
  resumeTime?: number;
  onClose: () => void;
  movieTitle?: string;
};

function getFullscreenElement(): Element | null {
  const doc = document as Document & {
    webkitFullscreenElement?: Element | null;
    msFullscreenElement?: Element | null;
  };
  return (
    document.fullscreenElement ??
    doc.webkitFullscreenElement ??
    doc.msFullscreenElement ??
    null
  );
}

async function enterFullscreen(el: HTMLElement) {
  const anyEl = el as HTMLElement & {
    requestFullscreen?: () => Promise<void>;
    webkitRequestFullscreen?: () => void;
    msRequestFullscreen?: () => void;
  };
  if (anyEl.requestFullscreen) {
    await anyEl.requestFullscreen();
    return;
  }
  if (anyEl.webkitRequestFullscreen) {
    anyEl.webkitRequestFullscreen();
    return;
  }
  if (anyEl.msRequestFullscreen) {
    anyEl.msRequestFullscreen();
    return;
  }
  throw new Error("Fullscreen API not available");
}

async function exitFullscreenDoc() {
  const doc = document as Document & {
    exitFullscreen?: () => Promise<void>;
    webkitExitFullscreen?: () => void;
    msExitFullscreen?: () => void;
  };
  if (doc.exitFullscreen) await doc.exitFullscreen();
  else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
  else if (doc.msExitFullscreen) doc.msExitFullscreen();
}

export function MoviePlayer({
  movieUrl,
  movieId,
  resumeTime = 0,
  onClose,
  movieTitle,
}: MoviePlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const durationRef = useRef(0);
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(resumeTime);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);

  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  useEffect(() => {
    const syncFs = () => setIsFullscreen(!!getFullscreenElement());
    document.addEventListener("fullscreenchange", syncFs);
    document.addEventListener("webkitfullscreenchange", syncFs as EventListener);
    syncFs();
    return () => {
      document.removeEventListener("fullscreenchange", syncFs);
      document.removeEventListener(
        "webkitfullscreenchange",
        syncFs as EventListener
      );
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      const d = Number.isFinite(video.duration) ? video.duration : 0;
      setDuration(d);
      if (resumeTime > 0) {
        try {
          video.currentTime = resumeTime;
        } catch {
          /* ignore */
        }
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      const t = Math.floor(video.currentTime);
      if (t > 0 && t % 5 === 0) {
        void saveProgress(video.currentTime);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlay = () => setIsBuffering(false);

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("canplay", handleCanPlay);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, [resumeTime, movieUrl]);

  const saveProgress = async (time: number) => {
    try {
      await fetch("/api/cw-player", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movie_id: movieId,
          progress: Math.floor(time),
        }),
      });
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  };

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    void (video.paused ? video.play() : video.pause());
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const next = !video.muted;
    video.muted = next;
    setIsMuted(next);
  }, []);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    const video = videoRef.current;
    if (!video) return;
    video.volume = newVolume;
    setVolume(newVolume);
    video.muted = newVolume === 0;
    setIsMuted(newVolume === 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skipTime = useCallback((seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    const d =
      durationRef.current ||
      (Number.isFinite(video.duration) ? video.duration : 0) ||
      0;
    video.currentTime = Math.max(0, Math.min(d || Infinity, video.currentTime + seconds));
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    try {
      if (!getFullscreenElement()) {
        try {
          await enterFullscreen(container);
        } catch {
          const v = video as HTMLVideoElement & {
            webkitEnterFullscreen?: () => void;
          };
          if (typeof v.webkitEnterFullscreen === "function") {
            v.webkitEnterFullscreen();
          }
        }
      } else {
        await exitFullscreenDoc();
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  }, []);

  const formatTime = (time: number) => {
    if (!Number.isFinite(time)) return "0:00";
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = setTimeout(() => {
      const v = videoRef.current;
      if (v && !v.paused) setShowControls(false);
    }, 3200);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const video = videoRef.current;
      if (!video) return;

      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" && e.key === " ") {
        return;
      }

      switch (e.key) {
        case " ":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
          e.preventDefault();
          skipTime(-10);
          break;
        case "ArrowRight":
          e.preventDefault();
          skipTime(10);
          break;
        case "f":
        case "F":
          e.preventDefault();
          void toggleFullscreen();
          break;
        case "m":
        case "M":
          e.preventDefault();
          toggleMute();
          break;
        case "Escape":
          e.preventDefault();
          if (getFullscreenElement()) {
            void exitFullscreenDoc();
          } else {
            onClose();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, togglePlay, toggleMute, toggleFullscreen, skipTime]);

  const handleClose = useCallback(() => {
    void (async () => {
      if (getFullscreenElement()) {
        try {
          await exitFullscreenDoc();
        } catch {
          /* ignore */
        }
      }
      onClose();
    })();
  }, [onClose]);

  const maxSeek = duration > 0 ? duration : Math.max(currentTime, 0);

  return (
    <div
      ref={containerRef}
      className="movie-player-fullscreen"
      onMouseMove={handleMouseMove}
      role="dialog"
      aria-label={movieTitle ? `Now playing: ${movieTitle}` : "Video player"}
      aria-modal="true"
    >
      <div className="player-vignette" aria-hidden />

      <video
        ref={videoRef}
        className="player-video"
        src={movieUrl}
        playsInline
        onClick={(e) => {
          e.stopPropagation();
          togglePlay();
        }}
      />

      {!isPlaying && (
        <button
          type="button"
          className="player-center-play"
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          aria-label="Play"
        >
          <Play size={56} fill="currentColor" strokeWidth={0} />
        </button>
      )}

      {isBuffering && (
        <div className="player-buffering">
          <div className="buffering-spinner" />
        </div>
      )}

      <header className="player-top-bar">
        <div className="player-top-bar-text">
          {movieTitle ? (
            <span className="player-title">{movieTitle}</span>
          ) : (
            <span className="player-title-muted">Now playing</span>
          )}
        </div>
        <button
          type="button"
          className="player-close"
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          aria-label="Close player"
        >
          <X size={22} strokeWidth={2.25} />
        </button>
      </header>

      <div
        className={`player-controls ${showControls ? "visible" : ""}`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <div className="controls-progress-container">
          <input
            type="range"
            className="controls-progress"
            min={0}
            max={maxSeek || 100}
            step={0.1}
            value={Math.min(currentTime, maxSeek || currentTime)}
            onChange={handleSeek}
            aria-label="Seek"
          />
          <div className="progress-time">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="controls-buttons">
          <div className="controls-left">
            <button
              type="button"
              onClick={() => togglePlay()}
              className="control-btn control-btn--primary"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={26} /> : <Play size={26} fill="currentColor" />}
            </button>

            <button
              type="button"
              onClick={() => skipTime(-10)}
              className="control-btn"
              aria-label="Back 10 seconds"
            >
              <SkipBack size={22} />
              <span className="skip-text">10</span>
            </button>

            <button
              type="button"
              onClick={() => skipTime(10)}
              className="control-btn"
              aria-label="Forward 10 seconds"
            >
              <SkipForward size={22} />
              <span className="skip-text">10</span>
            </button>

            <div className="volume-control">
              <button
                type="button"
                onClick={toggleMute}
                className="control-btn"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX size={22} />
                ) : (
                  <Volume2 size={22} />
                )}
              </button>
              <input
                type="range"
                className="volume-slider"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                aria-label="Volume"
              />
            </div>
          </div>

          <div className="controls-right">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                void toggleFullscreen();
              }}
              className="control-btn control-btn--accent"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
