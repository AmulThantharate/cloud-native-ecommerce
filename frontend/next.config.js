/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.dummyjson.com' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_GATEWAY_URL || 'http://localhost:8000'}/:path*`,
      },
    ];
  },
  env: {
    API_GATEWAY_URL: process.env.API_GATEWAY_URL,
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
  },
};

module.exports = nextConfig;
