"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/footer/footer";

const AUTH_PREFIXES = ["/signin", "/signup", "/otp"];

export function ConditionalFooter() {
  const pathname = usePathname() ?? "";
  const hide = AUTH_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (hide) return null;
  return <Footer />;
}
