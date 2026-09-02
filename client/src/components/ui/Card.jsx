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
      className={`relative overflow-hidden rounded-2xl border border-kitchen-border bg-kitchen-surface/95 text-parchment-100 shadow-candlelight backdrop-blur-sm p-5 sm:p-7 transition-all duration-300 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-terracotta-500/30 before:to-transparent ${accentStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card
