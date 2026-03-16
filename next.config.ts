import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow optimization for all local images
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
    qualities: [25, 50, 75, 90, 100],
  },
  // Enable experimental features for server actions
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
