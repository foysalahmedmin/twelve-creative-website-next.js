import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.0.110'],
  images: {

    remotePatterns: [
      {
        protocol: "https",
        hostname: "sasthyaseba.com",
      },
      {
        protocol: "https",
        hostname: "*.sasthyaseba.com",
      },
      {
        protocol: "https",
        hostname: "**.sasthyaseba.com",
      },
      {
        protocol: "https",
        hostname: "developer.android.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "doctime.com.bd"
      },
      {
        protocol: "https",
        hostname: "admin.twelvecreative.io"
      }
    ],
  },
};

export default nextConfig;
