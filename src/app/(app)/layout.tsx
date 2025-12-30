import { ReactNode } from "react";
import { Header } from "../../../Combiner/header/header";

export default function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
