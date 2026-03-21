"use client";

import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/header/header";

export default function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    // Add page transition class to body
    document.body.classList.add("page-transition");
    
    // Remove class after animation completes
    const timer = setTimeout(() => {
      document.body.classList.remove("page-transition");
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="app-route-shell">
      <Header />
      <div className="page-content">{children}</div>
    </div>
  );
}
