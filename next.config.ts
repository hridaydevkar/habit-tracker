import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Remove output/basePath for Vercel, or use for manual deployment
  // output: 'export',
  // basePath: '/habit-tracker',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
