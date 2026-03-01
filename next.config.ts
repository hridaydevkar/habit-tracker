import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: 'export',
  basePath: '/habit-tracker',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
