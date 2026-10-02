import type { NextConfig } from "next";

// CSP is managed per site by LIM-WAF; deploy its policy before this app build.

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
] as const;

const nextConfig: NextConfig = {
  output: "standalone",
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
    minimumCacheTTL: 31536000,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
    proxyClientMaxBodySize: "10mb",
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [...securityHeaders],
      },
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/uploads/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
