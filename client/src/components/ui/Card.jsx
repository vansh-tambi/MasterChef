import React from 'react'

export function Card({
  accent = false,
  className = '',
  children,
  ...props
}) {
  const accentStyle = accent ? 'border-l-4 border-l-terracotta-500' : ''
  const baseStyles = 'bg-cream-100/90 dark:bg-roast-900 border border-cream-200 dark:border-roast-700 rounded-xl shadow-tactile dark:shadow-none p-4 sm:p-6 transition-colors duration-200'

  return (
    <div className={`${baseStyles} ${accentStyle} ${className}`} {...props}>
      {children}
    </div>
  )
}

export default Card
