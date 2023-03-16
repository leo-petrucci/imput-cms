import { createStitches, CSS, globalCss } from '@stitches/react'
import { modernNormalize } from './modern-normalise'

const colors = {
  'gray-50': 'rgb(249 250 251)',
  'gray-100': 'rgb(243 244 246)',
  'gray-200': 'rgb(229 231 235)',
  'gray-300': 'rgb(209 213 219)',
  'gray-400': 'rgb(156 163 175)',
  'gray-500': 'rgb(107 114 128)',
  'gray-600': 'rgb(75 85 99)',
  'gray-700': 'rgb(55 65 81)',
  'gray-800': 'rgb(31 41 55)',
  'gray-900': 'rgb(17 24 39)',

  'primary-50': '#f4f7f7',
  'primary-100': '#e1eff5',
  'primary-200': '#bfdfea',
  'primary-300': '#8ec0d0',
  'primary-400': '#569db1',
  'primary-500': '#407d92',
  'primary-600': '#356377',
  'primary-700': '#2c4b5c',
  'primary-800': '#203342',
  'primary-900': '#14202c',

  'red-50': '#fef2f2',
  'red-100': '#fee2e2',
  'red-200': '#fecaca',
  'red-300': '#fca5a5',
  'red-400': '#f87171',
  'red-500': '#ef4444',
  'red-600': '#dc2626',
  'red-700': '#b91c1c',
  'red-800': '#991b1b',
  'red-900': '#7f1d1d',

  'blue-50': 'rgb(239 246 255)',
  'blue-100': 'rgb(219 234 254)',
  'blue-200': 'rgb(191 219 254)',
  'blue-300': 'rgb(147 197 253)',
  'blue-400': 'rgb(96 165 250)',
  'blue-500': 'rgb(59 130 246)',
  'blue-600': 'rgb(37 99 235)',
  'blue-700': 'rgb(29 78 216)',
  'blue-800': 'rgb(30 64 175)',
  'blue-900': 'rgb(30 58 138)',
}

const globalStyles = globalCss({
  ...modernNormalize,
})

globalStyles()

const stitchesConfig = {
  media: {
    sm: '(min-width: 640px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 1024px)',
    xl: '(min-width: 1280px)',
    '2xl': '(min-width: 1536px)',
  },
  theme: {
    colors,
    space: {
      px: '1px',
      0: '0',
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      8: '2rem',
      10: '2.5rem',
      12: '3rem',
      16: '4rem',
      20: '5rem',
      24: '6rem',
      32: '8rem',
      40: '10rem',
      48: '12rem',
      56: '14rem',
      64: '16rem',
    },
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fonts: {
      sans: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
      serif: `ui-serif, Georgia, Cambria, "Times New Roman", Times, serif`,
      mono: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
    },
    fontWeights: {
      thin: 100,
      extralight: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    lineHeights: {},
    letterSpacings: {},
    sizes: {
      0: '0rem',
      none: 'none',
      xs: '20rem',
      sm: '24rem',
      md: '28rem',
      lg: '32rem',
      xl: '36rem',
      '2xl': '42rem',
      '3xl': '48rem',
      '4xl': '56rem',
      '5xl': '64rem',
      '6xl': '72rem',
      '7xl': '80rem',
      full: '100%',
      'screen-sm': '640px',
      'screen-md': '768px',
      'screen-lg': '1024px',
      'screen-xl': '1280px',
      'screen-2xl': '1536px',
    },
    borderWidths: {
      default: '1px',
      0: '0',
      2: '2px',
      4: '4px',
      8: '8px',
    },
    borderStyles: {},
    radii: {
      none: '0',
      sm: '0.125rem',
      default: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      full: '9999px',
    },
    shadows: {
      sm: '0 1px 1px rgb(0 0 0 / 0.05)',
      base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      none: '0 0 #0000',
      ...colors,
    },
    zIndices: {
      0: 0,
      10: 10,
      20: 20,
      30: 30,
      40: 40,
      50: 50,
      auto: 'auto',
    },
    transitions: {},
  },
}

export const { styled, css, config } = createStitches(stitchesConfig)

export type CustomCSS = CSS<typeof config>

const _inlineCss = css({})
export const inlineCss = (css: CustomCSS) => _inlineCss({ css })