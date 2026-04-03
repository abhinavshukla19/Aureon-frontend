import axios from "axios";
import { Host } from "@/components/Global-exports/global-exports";

export type ToggleMyListResult = {
  success: boolean;
  inList?: boolean;
  message?: string;
};

export async function toggleMyListItem(
  token: string,
  movieId: number
): Promise<ToggleMyListResult> {
  const res = await axios.post(
    `${Host}/api/mylist/add-to-mylist`,
    { movie_id: movieId },
    { headers: { Authorization: token } }
  );
  return res.data as ToggleMyListResult;
}

export async function fetchMyListContains(
  token: string,
  movieId: number
): Promise<boolean> {
  const res = await axios.get(`${Host}/api/mylist/contains/${movieId}`, {
    headers: { Authorization: token },
  });
  if (!res.data?.success) return false;
  return Boolean(res.data.inList);
}
