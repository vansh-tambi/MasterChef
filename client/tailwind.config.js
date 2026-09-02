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
          glow: 'rgba(224, 83, 56, 0.25)',
        },
        /* ── Success: Rosemary / Alpine Sage ── */
        rosemary: {
          400: '#4E9F76',
          500: '#3D7055',
          600: '#2F5943',
        },
        /* ── Accent: Nordic Brass ── */
        brass: {
          400: '#E5AB4C',
          500: '#D49A3D',
          600: '#B8801B',
        },
      },
      boxShadow: {
        glow:      '0 8px 30px -4px rgba(224,83,56,0.10), 0 2px 8px -2px rgba(0,0,0,0.08)',
        'glow-lg': '0 12px 40px -4px rgba(224,83,56,0.16), 0 4px 12px -2px rgba(0,0,0,0.12)',
        stamp:     'inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 3px rgba(0,0,0,0.12)',
        tag:       '1px 2px 0px rgba(0,0,0,0.06)',
        dial:      'inset 0 2px 4px rgba(0,0,0,0.15), 0 1px 0 rgba(212,154,61,0.15)',
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
