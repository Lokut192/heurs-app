import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    /**
     * @see {@link https://nextjs.org/blog/next-15-2 | Nextjs 15.2}
     */
    viewTransition: true,
    /**
     * @see {@link https://nextjs.org/blog/next-15-2 | Nextjs 15.2}
     */
    nodeMiddleware: true,
    serverActions: {
      allowedOrigins: ['http://localhost:3000'],
    },
  },
  trailingSlash: false,
  poweredByHeader: false,
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    dirs: ['.'],
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/settings',
        destination: '/settings/account',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
