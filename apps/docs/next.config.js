const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx',
})

const path = require('path')

module.exports = withNextra({
  experimental: {
    externalDir: true,
  },
})
