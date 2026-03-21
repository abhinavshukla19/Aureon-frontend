"use client";

import { useEffect, useState } from "react";
import "./add-to-list.css";
import { Plus, Check, Loader2 } from "lucide-react";
import { useMyListToggle } from "@/hooks/useMyListToggle";
import { fetchMyListContains } from "@/lib/mylist-client";

type Props = {
  token: string;
  movieId: number;
  /** e.g. recommendation-grid `overlay-btn add-btn` */
  className?: string;
  ariaLabel?: string;
};

/**
 * Icon-only add/remove; stops propagation for use inside <Link> cards.
 */
export function AddToListIconButton({
  token,
  movieId,
  className = "",
  ariaLabel = "Add to My List",
}: Props) {
  const { toggle, busyMovieId } = useMyListToggle(token);
  const [inList, setInList] = useState(false);
  const busy = busyMovieId === movieId;

  useEffect(() => {
    let cancelled = false;
    void fetchMyListContains(token, movieId)
      .then((v) => {
        if (!cancelled) setInList(v);
      })
      .catch(() => {
        if (!cancelled) setInList(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token, movieId]);

  return (
    <button
      type="button"
      className={className}
      aria-label={inList ? "Remove from My List" : ariaLabel}
      title={inList ? "Remove from My List" : ariaLabel}
      disabled={busy}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void toggle(movieId, setInList);
      }}
    >
      {busy ? (
        <Loader2 size={20} className="add-to-list-spinner" aria-hidden />
      ) : inList ? (
        <Check size={20} strokeWidth={2.5} aria-hidden />
      ) : (
        <Plus size={20} strokeWidth={2.5} aria-hidden />
      )}
    </button>
  );
}
