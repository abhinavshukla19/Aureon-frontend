import { cookies } from "next/headers";
import { MyList } from "../../../../Components/my-list/my-list";
import axios from "axios";
import { Host } from "../../../../Components/Global-exports/global-exports";

type rowdata = {
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
  added_at?: string;
}

const MyListPage = async () => {
  let apiData: rowdata[] = [];
  let token: string | undefined;

  try {
    const cookieStore = await cookies();
    token = cookieStore.get("token")?.value;

    if (token) {
      const res = await axios.get(`${Host}/get_my_list`, {
        headers: { token: token }
      });
      if (res.data.data) {
        apiData = res.data.data as rowdata[];
      }
    }
  } catch (error: any) {
    console.log("Error fetching my list:", error);
  }

  // Dummy data for preview - remove this when you have real data
  if (apiData.length === 0) {
    apiData = [
      {
        movie_id: 1,
        title: "Stranger Things",
        description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl. A love letter to the '80s supernatural classics that captivated a generation.",
        release_year: 2016,
        duration: 50,
        genre: "Sci-Fi, Horror, Drama",
        banner_url: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=800&h=1200&fit=crop",
        movie_url: "",
        audio_languages: "English, Spanish, French",
        subtitle_languages: "English, Spanish, French, German",
        type: "TV",
        created_at: new Date().toISOString(),
        added_at: new Date().toISOString()
      },
      {
        movie_id: 2,
        title: "The Dark Knight",
        description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        release_year: 2008,
        duration: 152,
        genre: "Action, Crime, Drama",
        banner_url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=1200&fit=crop",
        movie_url: "",
        audio_languages: "English",
        subtitle_languages: "English, Spanish, French",
        type: "Movie",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        added_at: new Date(Date.now() - 86400000).toISOString()
      },
    ];
  }

  return <MyList apiData={apiData} token={token} />;
};

export default MyListPage;
