import React from 'react'

export function ThemeToggle({ theme, toggleTheme }) {
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl border border-cream-300 dark:border-kitchen-border bg-cream-50 dark:bg-kitchen-card text-charcoal-700 dark:text-parchment-100 hover:bg-cream-200 dark:hover:bg-kitchen-surface transition-all duration-200 active:scale-95 shadow-stamp flex items-center justify-center touch-manipulation cursor-pointer"
    >
      {isDark ? (
        /* Warm Sun Icon for Dark Mode (switch to light) */
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-mustard-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        /* Soft Moon Icon for Light Mode (switch to dark) */
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-charcoal-900"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  )
}

export default ThemeToggle
