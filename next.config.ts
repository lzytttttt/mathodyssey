import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Optimize package imports
  experimental: {
    optimizePackageImports: ['framer-motion', 'katex'],
  },
};

export default nextConfig;
