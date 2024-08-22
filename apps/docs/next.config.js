const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx',
})

const path = require('path')

module.exports = withNextra({
  experimental: {
    externalDir: true,
  },
  /**
   * Workaround for this issue
   * https://github.com/hashicorp/next-mdx-remote/issues/381#issuecomment-2057520430
   */
  transpilePackages: ['next-mdx-remote'],
})
