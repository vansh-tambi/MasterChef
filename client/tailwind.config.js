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
        display: ['"Playfair Display"', 'serif'],
        body: ['"Manrope"', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#F7F3EB',
          200: '#EFE8D8',
          300: '#E3D8C0',
        },
        terracotta: {
          100: '#F9EBE6',
          200: '#F4D7CD',
          500: '#C85A32',
          600: '#B34B25',
          700: '#963B19',
        },
        olive: {
          100: '#EDF2EA',
          500: '#586B4D',
          600: '#4A5B40',
          700: '#3D4C34',
        },
        charcoal: {
          500: '#857D75',
          700: '#524C46',
          900: '#262320',
          950: '#1A1816',
        },
        roast: {
          700: '#3D342D',
          800: '#2D2621',
          900: '#211C18',
          950: '#171412',
        },
      },
      boxShadow: {
        tactile: '0 2px 0 0 rgba(74, 59, 44, 0.08), 0 4px 12px 0 rgba(74, 59, 44, 0.04)',
        'tactile-hover': '0 4px 0 0 rgba(74, 59, 44, 0.1), 0 8px 20px 0 rgba(74, 59, 44, 0.06)',
      },
    },
  },
  plugins: [],
}
