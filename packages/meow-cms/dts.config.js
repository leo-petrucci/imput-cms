const css = require('rollup-plugin-import-css')

module.exports = {
  rollup(config, options) {
    config.plugins?.push(css())
    return config // always return a config.
  },
}
