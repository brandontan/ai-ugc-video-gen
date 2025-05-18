/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['huggingface.co'],
  },
  webpack: (config) => {
    // Handle file and buffer operations
    config.resolve.fallback = { 
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      dns: false,
      child_process: false,
    };
    return config;
  },
};

module.exports = nextConfig;
