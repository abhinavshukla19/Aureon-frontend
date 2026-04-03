import axios from "axios"
import { Host } from "@/components/Global-exports/global-exports" 
import { cookies } from "next/headers";
import { Newmoviepage, type Movie } from "@/components/newmovie/newmovie";
import { redirect } from "next/navigation";


const Newmovie=async()=>{
   let movie=[] as Movie[];
   const cookie=await cookies();
   const token=cookie.get("token")?.value; 

   if(!token){
    redirect("/signin")
   }
   
   try {
    const res=await axios.get(`${Host}/api/movie/get_all_movie`,{headers:{Authorization:token}})
    movie=res.data.data

  } catch (error) {
    console.log(error)
  }

    return(
        <>
        <Newmoviepage moviedata={movie} token={token} />
        </>
    )
}

export default Newmovie;
