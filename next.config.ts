import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['img.clerk.com'],
  },
  reactStrictMode: true,
  // other config options...
};

export default nextConfig;