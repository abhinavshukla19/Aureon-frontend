import axios from "axios";
import "./topfive.css"
import { Host } from "../Global-exports/global-exports";
import { cookies } from "next/headers";
import { ErrorHandler } from "../error-handler/error-handler";


type rowdata={
     movie_id: number,
    title: string,
    banner_url: string,
    rank_position:number
  }

export const Topfive = async() => {
  let data=[] as rowdata[]
  let errorMessage: string | null = null;
  
  try {
    const cookiestore=await cookies()
    const token=cookiestore.get("token")?.value
    if(!token){
      errorMessage = "Please sign in to view top movies.";
    } else {
      const res=await axios(`${Host}/topfivemovies`,{headers:{token:token}})
      if (res.data && res.data.data) {
        data=res.data.data as rowdata[]
      } else {
        errorMessage = "No top movies available at the moment.";
      }
    }
  } catch (error: any) {
    console.log(error);
    if (error?.code === 'ECONNREFUSED' || error?.code === 'ENOTFOUND') {
      errorMessage = "Unable to connect to the server. Please check your internet connection.";
    } else if (error?.response?.status === 401) {
      errorMessage = "Your session has expired. Please sign in again to view top movies.";
    } else if (error?.response?.status === 500) {
      errorMessage = "Our servers are experiencing issues. Please try again in a few moments.";
    } else if (error?.response?.status === 503) {
      errorMessage = "The service is temporarily unavailable. We're working on fixing it.";
    } else if (error?.message?.includes('timeout')) {
      errorMessage = "The request took too long. Please check your connection and try again.";
    } else if (error?.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else {
      errorMessage = "Failed to load top movies. Please refresh the page or try again later.";
    }
  }


  return (
    <section className="top-ten">
      <ErrorHandler error={errorMessage} title="Top Movies Error" />
      <h2 className="top-ten-title">Top 10 In Your Country Today</h2>

      {data.length === 0 && !errorMessage ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>No top movies available at the moment.</p>
        </div>
      ) : (
        <div className="top-ten-row">
          {data.map((item) => (
            <div key={item.rank_position} className="rank-card">
              <span className="rank-number">{item.rank_position}</span>

              <div className="rank-poster">
                <img src={item.banner_url} alt={item.title} />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
