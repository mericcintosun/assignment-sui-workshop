import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ensure static assets are properly served
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
