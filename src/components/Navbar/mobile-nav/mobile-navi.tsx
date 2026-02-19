"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "../../Global-exports/global-exports";
import "./mobile-navi.css";

export const Mobile_nav = () => {
  const pathname = usePathname();

  return (
    <nav className="mobile-bottom-nav">
      {navItems.map((item, index) => {
        const Icon = item.icon;
        const isActive = pathname === item.path;

        const handleHaptic = () => {
        if ("vibrate" in navigator) {
          navigator.vibrate(100); //  this help in vibration in android && ios me somethmes
        }
      };

        return (
          <Link
            href={item.path}
            onClick={handleHaptic}
            key={index}
            className={`mobile-nav-item ${isActive ? "active" : ""}`}
          >
            <Icon size={22} strokeWidth={1.8} />
          </Link>
        );
      })}
    </nav>
  );
};





// note:-
//  slice :- order wise dekhega list me 
// map :- us order ke hisab se loop chalega or same ko padega