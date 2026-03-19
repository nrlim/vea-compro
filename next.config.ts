import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [25, 50, 75, 90, 100],
    remotePatterns: [
      {
        // ── Legacy: existing DB records still point to the old Supabase CDN bucket.
        // New uploads write to /public/uploads/ (relative URL) and don't need this.
        // Safe to remove once all product imageUrl values are migrated to /uploads/…
        protocol: "https",
        hostname: "swejundhijnebpffxfvm.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // Allow larger server action body for image uploads (up to 10 MB)
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
