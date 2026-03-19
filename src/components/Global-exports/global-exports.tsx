export const Appname = "Aureon";
import { Home, List, Film, Settings, User } from "lucide-react";

export const navItems = [
  { name: "My List", path: "/my-list", icon: List },
  { name: "Movies", path: "/newmovie", icon: Film },
  { name: "Home", path: "/", icon: Home },
  { name: "Settings", path: "/settings", icon: Settings },
  { name: "Profile", path: "/profile", icon: User },
];



// export const Host="https://aureon-backend-fxqq.onrender.com"
export const Host="http://localhost:3001"