import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    // Optionally ignore ESLint during builds (not recommended)
    // ignoreDuringBuilds: false,
    // Specify directories to lint
    dirs: ['src'],
    // Disable specific ESLint rules
    // Note: Next.js ESLint config doesn't directly support 'rules' field, so use inline comments or .eslintrc
  },
  // Other config options here
};

export default nextConfig;
