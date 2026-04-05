import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AlertProvider } from "../components/alert/alert";
import { ConditionalFooter } from "../components/layout/conditional-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aureon - Watch TV Shows & Movies Online",
  description: "Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV. Join Aureon today.",
  icons: {
    icon: '/favicon.svg',
    apple: '/icon.svg',
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AlertProvider position="top-right" maxAlerts={5}>
          {children}
          <ConditionalFooter />
        </AlertProvider>
      </body>
    </html>
  );
}
