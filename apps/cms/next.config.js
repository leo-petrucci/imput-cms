const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    externalDir: true,
  },
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      cms: path.resolve(__dirname, '../../src/cms/'),
      'node_modules/modern-normalize/modern-normalize.css$': path.resolve(
        __dirname,
        '../../node_modules/modern-normalize/modern-normalize.css'
      ),
    }
    return config
  },
}

module.exports = nextConfig
