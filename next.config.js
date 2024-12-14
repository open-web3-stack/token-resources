/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        destination: '/:path*',
        source: '/:path*',
      },
    ];
  },
  trailingSlash: false,
};

module.exports = nextConfig
