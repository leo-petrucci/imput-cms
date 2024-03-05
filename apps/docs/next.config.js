const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx',
})

const path = require('path')

module.exports = withNextra({
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
})
