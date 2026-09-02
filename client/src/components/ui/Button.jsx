import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const variants = {
  primary:
    'bg-gradient-to-b from-terracotta-500 to-terracotta-600 text-parchment-100 hover:from-terracotta-400 hover:to-terracotta-500 active:from-terracotta-600 active:to-terracotta-700 shadow-candlelight border border-terracotta-400/30 focus-visible:ring-mustard-500',
  secondary:
    'bg-sage-600 text-parchment-100 hover:bg-sage-500 active:bg-sage-700 shadow-sm border border-sage-500/40 focus-visible:ring-sage-400',
  outline:
    'border border-kitchen-border bg-kitchen-card/80 text-parchment-200 hover:bg-kitchen-card hover:border-terracotta-500/50 hover:text-parchment-100 focus-visible:ring-terracotta-500',
  ghost:
    'text-parchment-300 hover:bg-kitchen-card/60 hover:text-parchment-100 focus-visible:ring-terracotta-500',
  gold:
    'bg-gradient-to-b from-mustard-400 to-mustard-500 text-kitchen-bg font-bold hover:from-mustard-300 hover:to-mustard-400 shadow-candlelight border border-mustard-300/40 focus-visible:ring-mustard-400',
}

const sizes = {
  sm: 'min-h-[44px] px-3.5 py-2 text-xs sm:text-sm',
  md: 'min-h-[44px] px-4.5 py-2.5 text-sm sm:text-base',
  lg: 'min-h-[48px] px-6 py-3 text-base sm:text-lg',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  children,
  ...props
}) {
  const shouldReduceMotion = useReducedMotion()

  const baseStyles =
    'font-body font-semibold inline-flex items-center justify-center rounded-xl transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-kitchen-bg touch-manipulation select-none cursor-pointer'

  const variantStyles = variants[variant] || variants.primary
  const sizeStyles = sizes[size] || sizes.md

  return (
    <motion.button
      disabled={disabled}
      whileHover={disabled || shouldReduceMotion ? undefined : { scale: 1.02 }}
      whileTap={disabled || shouldReduceMotion ? undefined : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default Button
