/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@lobehub/ui',
    '@lobehub/editor',
    '@xyflow/react',
    '@heroui/react',
    'framer-motion',
    'antd',
    'antd-style',
  ],
  webpack: (config, { isServer }) => {
    // Fix for Monaco Editor and other browser-only packages
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    
    return config;
  },
  typescript: {
    // Set to false in production
    ignoreBuildErrors: false,
  },
  eslint: {
    // Set to false in production
    ignoreDuringBuilds: false,
  },
  // Optimize for production
  swcMinify: true,
  
  // Image optimization
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
  },
}

module.exports = nextConfig
