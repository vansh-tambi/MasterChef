import React from 'react'

export function Card({
  accent = false,
  className = '',
  children,
  ...props
}) {
  const accentStyle = accent ? 'border-l-4 border-l-terracotta-500' : ''
  const baseStyles = 'bg-cream-100/90 border border-cream-200 rounded-xl shadow-tactile p-6'

  return (
    <div className={`${baseStyles} ${accentStyle} ${className}`} {...props}>
      {children}
    </div>
  )
}

export default Card
