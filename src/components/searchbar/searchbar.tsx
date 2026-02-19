"use client"
import "./searchbar.css"
import { useState } from "react"



export const Searchbar=()=>{
    const [searchvalue, setsearchvalue] = useState<string>("")



    const handlebutton=()=>[
        setsearchvalue("")
    ]

    return(
        <div className="search-form">
            <input onChange={(e)=>{setsearchvalue(e.target.value)}} placeholder="Search for movies" type="text" value={searchvalue} className="search-input" />
            <button onClick={handlebutton} className="cancel-btn">x</button>
        </div>
    )
}