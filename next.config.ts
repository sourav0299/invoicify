import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['img.clerk.com', 'res.cloudinary.com'],
  },
  reactStrictMode: true,
};

module.exports = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/landing",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;