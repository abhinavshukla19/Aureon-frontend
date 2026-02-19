import axios from "axios"
import { Host } from "@/components/Global-exports/global-exports" 
import { cookies } from "next/headers";
import { Newmoviepage } from "@/components/newmovie/newmovie";
import { redirect } from "next/navigation";

interface Movie {
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
}


const Newmovie=async()=>{
   let movie=[] as Movie[];
   const cookie=await cookies();
   const token=cookie.get("token")?.value; 

   if(!token){
    redirect("/signin")
   }
   
   try {
    const res=await axios.get(`${Host}/get_all_movie`,{headers:{token:token}})
    movie=res.data.data

  } catch (error) {
    console.log(error)
  }

    return(
        <>
        <Newmoviepage moviedata={movie}/>
        </>
    )
}

export default Newmovie;