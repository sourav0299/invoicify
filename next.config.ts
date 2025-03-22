/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['img.clerk.com', 'res.cloudinary.com'],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
