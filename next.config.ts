import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.0.110"],
  // The blog moved from /blogs to /insights to match the wording used
  // everywhere else. Permanent so already-indexed URLs and any link shared
  // before the rename keep working instead of 404ing.
  async redirects() {
    return [
      { source: "/blogs", destination: "/insights", permanent: true },
      {
        source: "/blogs/:slug",
        destination: "/insights/:slug",
        permanent: true,
      },
    ];
  },
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      { protocol: "https", hostname: "twelvecreative.io" },
      { protocol: "https", hostname: "admin.twelvecreative.io" },
      { protocol: "https", hostname: "storage.googleapis.com" },
      { protocol: "https", hostname: "placehold.co" },
      ...(process.env.NODE_ENV !== "production"
        ? [
            { protocol: "http" as const, hostname: "localhost" },
            { protocol: "http" as const, hostname: "127.0.0.1" },
          ]
        : []),
    ],
  },
};

export default nextConfig;
