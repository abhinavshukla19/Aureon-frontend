import "./recommendation.css"

const movies = [
    {
        name: "Stranger Things",
        genre: "Sci-Fi",
        match: "97% Match",
        desc: "A group of friends in a small town discover a strange girl who has supernatural powers.",
        url: "https://m.media-amazon.com/images/I/91txlu5NEfL.jpg",
      },
      {
        name: "The Boys",
        genre: "Action",
        match: "97% Match",
        desc: "A group of vigilantes fight against corrupt superheroes who abuse their powers.",
        url: "https://images3.alphacoders.com/112/1120679.jpg",
      },
    {
      name: "Money Heist",
      genre: "Thriller",
      match: "98% Match",
      desc: "A group of robbers plan and execute heists to rob the Royal Mint of Spain.",
      url: "https://svijetfilma.eu/wp-content/uploads/2020/03/Money-Heist-Season-4-1280x720-1.jpg",
    }
    
];


export const Recommendation=()=>{
    return(
        <>
        <div className="recommendation-main-outer-div">
            <div className="recommendation-para-div">
                <h2 className="recommend-para">MORE LIKE THIS</h2>
            </div>
            <div className="recommendation-main-div">
                 {movies.map((item,idx)=>{
                return <div key={idx} className="recommendation-div">
                    <div className="recommendation-image-div">
                       <img src={item.url} alt={item.name} />
                    </div>
                    <div className="recommendation-detail-div">
                        <p className="recommend-name">{item.name}</p>
                        <div className="recommendation-meta-row">
                            <span className="recommendation-genre">{item.genre}</span>
                            <span className="recommendation-match">{item.match}</span>
                        </div>
                        <p className="recommendation-desc">{item.desc}</p>
                    </div> 
                </div>
            })}
            </div>    
        </div>
        </>
    )
}