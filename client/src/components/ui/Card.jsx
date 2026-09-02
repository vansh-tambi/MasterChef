import React from 'react'

export function Card({
  accent = false,
  className = '',
  children,
  ...props
}) {
  const accentStyle = accent
    ? 'border-l-4 border-l-terracotta-500'
    : ''

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-kitchen-border bg-kitchen-surface/95 text-parchment-100 shadow-candlelight backdrop-blur-sm p-5 sm:p-8 transition-all duration-300 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-terracotta-500/35 before:to-transparent ${accentStyle} ${className}`}
      {...props}
    >
      {/* Faint Oversized Vintage Culinary Watermark Emblem (3% opacity) */}
      <div
        className="pointer-events-none absolute -right-12 -bottom-12 w-64 h-64 opacity-[0.035] select-none text-parchment-100"
        aria-hidden="true"
      >
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" />
          <circle cx="100" cy="100" r="76" stroke="currentColor" strokeWidth="1.5" />
          <path d="M50 150 L150 50" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <path d="M150 150 L50 50" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <circle cx="100" cy="100" r="18" fill="currentColor" />
          <text x="100" y="170" textAnchor="middle" fill="currentColor" fontSize="11" fontFamily="sans-serif" letterSpacing="4">
            EST. 2026 BRIGADE
          </text>
        </svg>
      </div>

      {children}
    </div>
  )
}

export default Card
