/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Manrope"', 'sans-serif'],
        hand: ['"Caveat"', 'cursive'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        kitchen: {
          bg: '#12100E',
          surface: '#1C1815',
          card: '#241E1A',
          border: '#3B312A',
          muted: '#52453C',
        },
        cream: {
          50: '#FAF8F5',
          100: '#F4EFE6',
          200: '#E8DFD1',
          300: '#DACDBA',
          400: '#C7B49B',
        },
        roast: {
          700: '#3B312A',
          800: '#26201C',
          900: '#1C1815',
          950: '#12100E',
        },
        terracotta: {
          400: '#D96E47',
          500: '#C85A32',
          600: '#AE4822',
        },
        sage: {
          400: '#758A69',
          500: '#586B4D',
          600: '#43523B',
        },
        mustard: {
          400: '#EDB03A',
          500: '#D99B26',
          600: '#B8801B',
        },
        parchment: {
          100: '#FAF6EE',
          200: '#EDE4D1',
          300: '#D9CEB6',
        },
        charcoal: {
          500: '#857D75',
          700: '#524C46',
          900: '#262320',
          950: '#1A1816',
        },
      },
      boxShadow: {
        candlelight: '0 8px 32px -4px rgba(200, 90, 50, 0.08), 0 2px 8px -1px rgba(0, 0, 0, 0.4)',
        'candlelight-hover': '0 12px 40px -4px rgba(200, 90, 50, 0.14), 0 4px 12px -1px rgba(0, 0, 0, 0.6)',
        press: '0 2px 4px 0 rgba(0, 0, 0, 0.5)',
        stamp: 'inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 2px 4px rgba(0,0,0,0.3)',
        'butcher-tag': '2px 3px 0px rgba(0, 0, 0, 0.4)',
        'brass-dial': 'inset 0 2px 4px rgba(0,0,0,0.6), 0 1px 0 rgba(217,155,38,0.2)',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.82', transform: 'scale(0.98)' },
        },
        stampIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '70%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        flicker: 'flicker 3s ease-in-out infinite',
        stamp: 'stampIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
      },
    },
  },
  plugins: [],
}
