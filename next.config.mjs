/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.experiments = { ...config.experiments, topLevelAwait: true }
    // Optimize chunk loading
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
      chunkIds: 'deterministic'
    }
    return config
  },
  // Increase timeout for chunk loading
  staticPageGenerationTimeout: 120,
  experimental: {
    optimizeCss: true,
  }
};

export default nextConfig;
