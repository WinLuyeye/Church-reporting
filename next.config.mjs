/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'google.com',
        pathname: '/customers/**',
      },
      {
        protocol: 'https',
        hostname: 'example.com', // Si tu utilises aussi d'autres domaines
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
