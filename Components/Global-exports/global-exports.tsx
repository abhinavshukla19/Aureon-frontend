export const Appname = "Aureon";
import { Home, List, Film, Settings, User } from "lucide-react";

export const navItems = [
  { name: "My List", path: "/my-list", icon: List },
  { name: "Movies", path: "/movies", icon: Film },
  { name: "Home", path: "/", icon: Home },
  { name: "Settings", path: "/settings", icon: Settings },
  { name: "Profile", path: "/profile", icon: User },
];


// export const Host="http://127.0.0.1:3001"
export const Host=process.env.PUBLIC_API_URL