const colors = require('tailwindcss/colors')
const { fontFamily } = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')
const animate = require('tailwindcss-animate')
const typography = require('@tailwindcss/typography')

/** @type {import('tailwindcss').Config} */
const tailwind = {
  darkMode: ['class'],
  prefix: 'imp-',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './utils/**/*.{ts,tsx}',
    './theme.config.jsx',
    '../../packages/components/**/*.{ts,tsx}',
    '../../packages/imput-cms/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        ...colors,
        scarlet: {
          50: '#fff4ec',
          100: '#ffe7d3',
          200: '#ffcaa6',
          300: '#ffa56d',
          400: '#ff7433',
          500: '#ff4e0b',
          600: '#fb3301',
          700: '#cb2103',
          800: '#a11c0b',
          900: '#81190d',
          950: '#460904',
        },
        border: 'hsl(214.3 31.8% 91.4%)',
        input: 'hsl(214.3 31.8% 91.4%)',
        ring: 'hsl(215 20.2% 65.1%)',
        background: 'hsl(0 0% 100%)',
        foreground: 'hsl(222.2 47.4% 11.2%)',
        primary: {
          DEFAULT: 'hsl(222.2 47.4% 11.2%)',
          foreground: 'hsl(210 40% 98%)',
        },
        secondary: {
          DEFAULT: 'hsl(210 40% 96.1%)',
          foreground: 'hsl(222.2 47.4% 11.2%)',
        },
        destructive: {
          DEFAULT: 'hsl(0 100% 50%)',
          foreground: 'hsl(210 40% 98%)',
        },
        muted: {
          DEFAULT: 'hsl(210 40% 96.1%)',
          foreground: 'hsl(215.4 16.3% 46.9%)',
        },
        accent: {
          DEFAULT: 'hsl(210 40% 96.1%)',
          foreground: 'hsl(222.2 47.4% 11.2%)',
        },
        popover: {
          DEFAULT: 'hsl(0 0% 100%)',
          foreground: 'hsl(222.2 47.4% 11.2%)',
        },
        card: {
          DEFAULT: 'hsl(0 0% 100%)',
          foreground: 'hsl(222.2 47.4% 11.2%)',
        },
      },
      borderRadius: {
        lg: '0.5rem',
        md: 'calc(0.5rem - 2px)',
        sm: 'calc(0.5rem - 4px)',
      },
      fontFamily: {
        sans: [...fontFamily.sans],
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    animate,
    typography,
    require('tailwindcss-animate'),
    require('@tailwindcss/container-queries'),
    plugin(({ addVariant }) => {
      addVariant('children', '& > *'), addVariant('textarea', '& textarea')
    }),
  ],
}

module.exports = { tailwind }
