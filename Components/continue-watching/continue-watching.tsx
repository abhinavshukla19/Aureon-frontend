import "./continue-watching.css"


export const Continue_watching=()=>{

    const movies = [
    {
      name: "Money Heist",
      time: "2hr 55min",
      progress:29,
      episode: "S03 EP-04",
      url: "https://svijetfilma.eu/wp-content/uploads/2020/03/Money-Heist-Season-4-1280x720-1.jpg",
    },
    {
      name: "Rana Naidu",
      time: "1hr 08min",
      progress:41,
      episode: "S02 EP-06",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl7iX_Y-7TlMLT1_gpp6sdlv0KCw3GhJTLrQ&s",
    },
    {
      name: "It Ends With US",
      time: "2hr 23min",
      episode:null,
      progress:10,
      url: "https://movieswetextedabout.com/wp-content/uploads/2024/08/It-Ends-With-Us-Banner.jpg",
    },
    {
      name: "Marco",
      time: "2hr 54min",
      episode:null,
      progress:69,
      url: "https://www.acmodasi.in/amdb/images/movie/1/0/marco-2024-szoXS9.jpg",
    },
    {
      name: "Love at First Sight",
      time: "2hr 13min",
      episode:null,
      progress:81,
      url: "https://encrypted-tbn0.gstatic.com/https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZ9hWNPJHpDxC3mLIrh3POavCywM4NhwcIIQ&s?q=tbn:ANd9GcTl7iX_Y-7TlMLT1_gpp6sdlv0KCw3GhJTLrQ&s",
    },
    {
      name: "Dhurendhar",
      time: "3hr 39min",
      episode:null,
      progress:81,
      url: "https://images.moneycontrol.com/static-mcnews/2025/07/20250707120301_dhss.jpg?impolicy=website&width=770&height=431",
    }
  ];


  return (
    <div className="continue-watching-main-div">
      <div className="continue-watching-head-div">
        <p className="continue-watching-para">Continue Watching for Alex</p>
      </div>
      <div className="continue-watching-div">
        {movies.map((movie, idx) => {
          return (
            <div key={idx} className="continue-watching-repeat-div">
              <div className="continue-watching-image">
                <img src={movie.url} alt={movie.name} />
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${movie.progress}%` }}
                  />
                </div>
              </div>
              <div className="continue-watching-detail-div">
                <div className="continue-watching-name-div">
                  <p className="continue-watching-name">{movie.name}</p>
                  <p className="continue-watching-episode">{movie.episode}</p>
                </div>
                <div className="continue-watching-time-div">
                  <p className="continue-watching-time-para">{movie.time}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}



