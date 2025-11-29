import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

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

  allowedDevOrigins: ['jis.mechnet.in'],
  trailingSlash: true
};

export default nextConfig;
