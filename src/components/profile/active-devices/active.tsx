import axios from "axios";
import "./active.css";
import { Host } from "../../../Components/Global-exports/global-exports";
import { cookies } from "next/headers";
import { timeAgo } from "./timeteller";

type rowdata={
    device_name:string;
    location:string;
    is_current:number;
    last_active_at:string;
}


export const Active_device=async()=>{
    const cookie=await cookies();
    const token=cookie.get("token")?.value;
    let data=[] as rowdata[];

    try {
        
        const res=await axios.get(`${Host}/get-devices`,{headers:{token:token}})
        data=res.data.data;

    } catch (error) {
        console.log(error)
    }

    return(
        <>
        <div className="card">

          {data.map((data) => {
            return(
            <div key={data.is_current} className="device-card">
              <p className="device-para">{data.device_name}</p>
              <p className="location-para">{data.location}</p>
              <p className="last-session-para">{timeAgo(data.last_active_at)}</p>
            </div>

            )
})}
        </div>
        </>
    )
}