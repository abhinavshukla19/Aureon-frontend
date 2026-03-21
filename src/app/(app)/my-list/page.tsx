import { cookies } from "next/headers";
import { MyList } from "@/components/my-list/my-list";
import axios from "axios";
import { Host } from "@/components/Global-exports/global-exports";
import { redirect } from "next/navigation";

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
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value as string | undefined;

    if (!token) {
      redirect("/signin");
    }

  try {
    
    const res = await axios.get(`${Host}/api/mylist/get_my_list`, {
      headers: { token },
    });
    if (res.data.data) {
      apiData = res.data.data as rowdata[];
    }
      
  } catch (error: any) {
    console.log("Error fetching my list:", error);
  }

  return <MyList apiData={apiData} token={token} />;
};

export default MyListPage;
