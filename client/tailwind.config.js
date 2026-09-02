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
        /* ──────────────────────────────────────────────
         * Semantic surface tokens backed by CSS vars
         * (swap instantly when .dark toggles on <html>)
         * ────────────────────────────────────────────── */
        canvas:     'var(--c-canvas)',
        surface:    'var(--c-surface)',
        elevated:   'var(--c-elevated)',
        'panel-border': 'var(--c-border)',

        ink: {
          DEFAULT:  'var(--c-ink)',
          secondary:'var(--c-ink-secondary)',
          muted:    'var(--c-ink-muted)',
          inverse:  'var(--c-ink-inverse)',
        },

        /* ── Hero: Ember / Persimmon ── */
        ember: {
          400: '#F06548',
          500: '#E05338',
          600: '#C74127',
          700: '#8F2815',
          glow: 'rgba(224, 83, 56, 0.25)',
        },
        /* ── Success: Rosemary / Alpine Sage ── */
        rosemary: {
          400: '#4E9F76',
          500: '#3D7055',
          600: '#2F5943',
          700: '#1B3D2C',
        },
        /* ── Accent: Nordic Brass ── */
        brass: {
          400: '#E5AB4C',
          500: '#D49A3D',
          600: '#B8801B',
          700: '#8A601E',
        },
      },
      boxShadow: {
        retro:       '3px 3px 0px 0px rgba(26, 29, 32, 1)',
        'retro-sm':  '2px 2px 0px 0px rgba(26, 29, 32, 0.9)',
        'retro-lg':  '4px 4px 0px 0px rgba(26, 29, 32, 1)',
        'retro-ember': '3px 3px 0px 0px #8F2815',
        'retro-rosemary': '3px 3px 0px 0px #1B3D2C',
        'retro-brass': '3px 3px 0px 0px #8A601E',
        'retro-card': '4px 4px 0px 0px rgba(26, 29, 32, 0.10)',
        'retro-card-dark': '4px 4px 0px 0px rgba(0, 0, 0, 0.5)',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.82', transform: 'scale(0.98)' },
        },
        stampIn: {
          '0%':   { transform: 'scale(0.8)', opacity: '0' },
          '70%':  { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        flicker: 'flicker 3s ease-in-out infinite',
        stamp:   'stampIn 0.25s cubic-bezier(0.175,0.885,0.32,1.275) forwards',
      },
    },
  },
  plugins: [],
}
