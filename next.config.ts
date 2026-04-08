import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // All images served from /public/uploads/ (local VPS filesystem).
    // No external CDN remotePatterns needed post-Supabase-storage migration.
    remotePatterns: [],
  },
  // Allow larger server action body for image uploads (up to 10 MB)
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
