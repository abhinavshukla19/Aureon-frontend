/**
 * Extract YouTube video id from common URL shapes (watch, embed, shorts, youtu.be).
 * Returns null if the string is not a recognizable YouTube link.
 */
export function getYoutubeVideoId(url: string): string | null {
  if (!url || typeof url !== "string") return null;
  const raw = url.trim();
  if (!raw) return null;

  let parsed: URL | null = null;
  try {
    parsed = new URL(raw);
  } catch {
    try {
      parsed = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    } catch {
      parsed = null;
    }
  }

  if (parsed) {
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = parsed.pathname.replace(/^\//, "").split("/")[0];
      return id || null;
    }
    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      const v = parsed.searchParams.get("v");
      if (v) return v;
      const parts = parsed.pathname.split("/").filter(Boolean);
      const embedIdx = parts.indexOf("embed");
      if (embedIdx >= 0 && parts[embedIdx + 1]) return parts[embedIdx + 1];
      const shortsIdx = parts.indexOf("shorts");
      if (shortsIdx >= 0 && parts[shortsIdx + 1]) return parts[shortsIdx + 1];
      const liveIdx = parts.indexOf("live");
      if (liveIdx >= 0 && parts[liveIdx + 1]) return parts[liveIdx + 1];
    }
  }

  const m =
    raw.match(/youtu\.be\/([^?&/#]+)/) ||
    raw.match(/youtube\.com\/embed\/([^?&/#]+)/) ||
    raw.match(/youtube\.com\/shorts\/([^?&/#]+)/);
  return m ? m[1] : null;
}

/** Background hero: autoplay muted loop, minimal chrome */
export function buildYoutubeHeroEmbedSrc(videoId: string): string {
  const q = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: videoId,
    controls: "0",
    playsinline: "1",
    rel: "0",
    modestbranding: "1",
  });
  return `https://www.youtube.com/embed/${videoId}?${q.toString()}`;
}

/** Full player: YouTube’s own controls; `start` is seconds */
export function buildYoutubeWatchEmbedSrc(
  videoId: string,
  startSeconds = 0
): string {
  const q = new URLSearchParams({
    autoplay: "1",
    start: String(Math.max(0, Math.floor(startSeconds))),
    rel: "0",
    modestbranding: "1",
  });
  return `https://www.youtube.com/embed/${videoId}?${q.toString()}`;
}
