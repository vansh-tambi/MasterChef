import React from 'react'

export function ThemeToggle({ theme, toggleTheme }) {
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="min-h-[40px] min-w-[40px] p-2 rounded-md border-2 border-panel-border bg-surface text-ink-secondary hover:text-ink hover:bg-elevated transition-all duration-100 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none shadow-[2px_2px_0px_0px_rgba(26,29,32,0.12)] dark:shadow-[2px_2px_0px_0px_#000] flex items-center justify-center touch-manipulation cursor-pointer"
    >
      {isDark ? (
        /* Sun Icon → switch to light */
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 text-brass-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        /* Moon Icon → switch to dark */
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 text-ink"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
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
