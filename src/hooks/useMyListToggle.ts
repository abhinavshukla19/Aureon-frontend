"use client";

import { useCallback, useState } from "react";
import { useAlert } from "@/components/alert/alert";
import { toggleMyListItem } from "@/lib/mylist-client";

/**
 * Shared My List toggle + toast + per-movie busy state (use one hook per component tree).
 */
export function useMyListToggle(token?: string) {
  const { showSuccess, showError } = useAlert();
  const [busyMovieId, setBusyMovieId] = useState<number | null>(null);

  const toggle = useCallback(
    async (movieId: number, onInList?: (inList: boolean) => void) => {
      if (!token) {
        showError("Please sign in to use My List", "My List");
        return;
      }
      setBusyMovieId(movieId);
      try {
        const data = await toggleMyListItem(token, movieId);
        if (data.success) {
          const inList = Boolean(data.inList);
          onInList?.(inList);
          showSuccess(
            data.message || (inList ? "Added to your list" : "Removed from your list")
          );
        } else {
          showError(data.message || "Could not update your list");
        }
      } catch (e: unknown) {
        const ax = e as { response?: { data?: { message?: string }; status?: number } };
        if (ax?.response?.status === 401) {
          showError("Session expired. Please sign in again.");
        } else {
          showError(ax?.response?.data?.message || "Could not update your list");
        }
      } finally {
        setBusyMovieId(null);
      }
    },
    [token, showSuccess, showError]
  );

  return {
    toggle,
    busyMovieId,
    isListBusy: busyMovieId !== null,
  };
}
