import React from 'react'

const variants = {
  primary: 'bg-terracotta-500 text-cream-50 hover:bg-terracotta-600 active:bg-terracotta-700 shadow-sm',
  secondary: 'bg-olive-500 text-cream-50 hover:bg-olive-600 active:bg-olive-700 shadow-sm',
  outline: 'border border-cream-300 bg-cream-50 text-charcoal-900 hover:bg-cream-100 hover:border-cream-400',
  ghost: 'text-charcoal-700 hover:bg-cream-200/60 hover:text-charcoal-900',
}

const sizes = {
  sm: 'min-h-[44px] px-3.5 py-2.5 text-xs sm:text-sm',
  md: 'min-h-[44px] px-4 py-2.5 text-sm sm:text-base',
  lg: 'min-h-[48px] px-5 py-3 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  children,
  ...props
}) {
  const baseStyles =
    'font-body font-semibold inline-flex items-center justify-center rounded-lg transition-all duration-150 ease-out active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500/50 touch-manipulation select-none'

  const variantStyles = variants[variant] || variants.primary
  const sizeStyles = sizes[size] || sizes.md

  return (
    <button
      disabled={disabled}
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
