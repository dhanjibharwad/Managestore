import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  devIndicators: false,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8002',
      },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },

  trailingSlash: true
};

export default nextConfig;
