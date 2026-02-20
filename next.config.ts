import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aureon-backend-fxqq.onrender.com',
      },
      {
        protocol: 'http',
        hostname: 'aureon-backend-fxqq.onrender.com',
      },
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
      },
      {
        protocol: 'http',
        hostname: 'image.tmdb.org',
      },
    ],
    unoptimized: false,
  },
};

export default nextConfig;
