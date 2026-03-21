import { redirect } from "next/navigation";

/** Legacy `/movies` URLs → catalog lives at `/newmovie` */
export default function MoviesRedirectPage() {
  redirect("/newmovie");
}
