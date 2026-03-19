import { Suspense } from "react";
import { cookies } from "next/headers";
import { MovieDetailContent } from "./components/movie-detail/movie-detail";
import { ErrorScreen } from "./components/error-screen/error-screen";
import { MovieDetailSkeleton } from "./components/movie-detail-skeliton/movie-detail-skeliton";
import { Host } from "@/components/Global-exports/global-exports";

type PageProps = {
  params: Promise<{ id: string }>;
};

type RecommendationMovie = {
  movie_id: string;
  title: string;
  genre: string;
  banner_url: string;
  match_percentage: number;
  description: string;
  duration: number;
  release_year: number;
};


async function fetchCompleteMovieData(movieId: string, token: string) {
  try {
    const [movieRes, castRes] = await Promise.allSettled([
      fetch(`${Host}/api/movie/moviedetailbyid/${movieId}`, {
        headers: { token },
        next: { revalidate: 300 } // Cache for 5 minutes
      }),
      fetch(`${Host}/api/cast/get-cast?movie_id=${movieId}`, {
        headers: { token },
        next: { revalidate: 600 }
      })
    ]);

    const movie = movieRes.status === 'fulfilled' && movieRes.value.ok
      ? (await movieRes.value.json()).data 
      : null;
    
    const cast = castRes.status === 'fulfilled' && castRes.value.ok
      ? (await castRes.value.json()).data || []
      : [];
    
    // Recommendations and progress are currently provided via dummy data / not yet implemented
    const recommendations: RecommendationMovie[] = [];
    const progress = null;

    return { movie, cast, recommendations, progress };
  } catch (error) {
    console.error("Fatal error fetching movie data:", error);
    return { movie: null, cast: [], recommendations: [], progress: null };
  }
}


const dummyRecommendations: RecommendationMovie[] = [
  {
    movie_id: "1",
    title: "Inception",
    genre: "Sci-Fi",
    banner_url: "https://image.tmdb.org/t/p/w500/8h58bY1nX3X7K3V6gYv8v2X5p9s.jpg",
    match_percentage: 92,
    description: "A skilled thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.",
    duration: 148,
    release_year: 2010
  },
  {
    movie_id: "2",
    title: "The Dark Knight",
    genre: "Action",
    banner_url: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    match_percentage: 88,
    description: "Batman faces the Joker, a criminal mastermind who plunges Gotham City into chaos and tests the limits of the Dark Knight.",
    duration: 152,
    release_year: 2008
  },
  {
    movie_id: "3",
    title: "Interstellar",
    genre: "Sci-Fi",
    banner_url: "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    match_percentage: 85,
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    duration: 169,
    release_year: 2014
  },
  {
    movie_id: "4",
    title: "The Matrix",
    genre: "Sci-Fi",
    banner_url: "https://image.tmdb.org/t/p/w500/aoiC6uHkN7c6bJz3Vh5b9q3D9nY.jpg",
    match_percentage: 74,
    description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    duration: 136,
    release_year: 1999
  },
  {
    movie_id: "5",
    title: "Avengers: Endgame",
    genre: "Superhero",
    banner_url: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    match_percentage: 67,
    description: "After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos' actions and restore balance.",
    duration: 181,
    release_year: 2019
  },
  {
    movie_id: "6",
    title: "Joker",
    genre: "Drama",
    banner_url: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    match_percentage: 55,
    description: "A mentally troubled comedian embarks on a downward spiral that leads to the creation of an iconic villain.",
    duration: 122,
    release_year: 2019
  }
];


export default async function MovieDetailPage({ params }: PageProps) {
  const { id: movieId } = await params;

  if (!movieId) {
    return <ErrorScreen message="Invalid movie ID" />;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return <ErrorScreen message="Please sign in to watch movies" showSignIn />;
  }

  const { movie, cast, recommendations, progress } = await fetchCompleteMovieData(movieId, token);

  if (!movie) {
    return <ErrorScreen message="Movie not found" type="404" />;
  }

  return (
    <div className="movie-detail-page-wrapper">
      <Suspense fallback={<MovieDetailSkeleton />}>
        <MovieDetailContent 
          movie={movie}
          cast={cast}
          recommendations={dummyRecommendations}
          progress={progress}
        />
      </Suspense>
    </div>
  );
}