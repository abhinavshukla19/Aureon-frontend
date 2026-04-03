import axios, { AxiosHeaderValue } from "axios";
import "./topfive.css"
import { Host } from "../Global-exports/global-exports";
import { ErrorHandler } from "../error-handler/error-handler";
import { TopFiveRankCard } from "./TopFiveRankCard";
import { handleAxiosError } from "@/app/api/ApiErrorHandler/errorHadler";


type rowdata={
    movie_id: number,
    title: string,
    banner_url: string,
    rank_position:number
  }
  
type tokentype={
  token:AxiosHeaderValue | undefined;
}

export const Topfive = async({token}:tokentype) => {
  let data=[] as rowdata[]
  let errorMessage: string | null = null;
  
  try {

      const res=await axios(`${Host}/api/movie/topfivemovies`,{headers:{ Authorization: token}})
      if (res.data && res.data.data) {
        data=res.data.data as rowdata[]
      } else {
        errorMessage = "No top movies available at the moment.";
      }

  } catch (error: any) {
    console.log(error);
    errorMessage = handleAxiosError(error).message as string;
  }


  return (
    <section className="top-ten">
      <ErrorHandler error={errorMessage} title="Top Movies Error" />
      <h2 className="top-ten-title">Top 5 In Your Country Today</h2>

      {data.length === 0 && !errorMessage ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>No top movies available at the moment.</p>
        </div>
      ) : (
        <div className="top-ten-row">
          {data.map((item) => (
            <TopFiveRankCard
              key={item.rank_position}
              item={item}
              token={String(token ?? "")}
            />
          ))}
        </div>
      )}
    </section>
  );
};
