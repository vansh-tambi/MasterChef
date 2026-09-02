import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const variants = {
  primary:
    'bg-ember-500 hover:bg-ember-600 active:bg-ember-600 text-white shadow-glow border border-ember-600/20 focus-visible:ring-ember-400',
  secondary:
    'bg-rosemary-500 hover:bg-rosemary-400 active:bg-rosemary-600 text-white shadow-sm border border-rosemary-600/20 focus-visible:ring-rosemary-400',
  outline:
    'border border-panel-border bg-transparent text-ink hover:bg-elevated active:bg-elevated focus-visible:ring-ember-400',
  ghost:
    'text-ink-muted hover:bg-elevated hover:text-ink focus-visible:ring-ember-400',
  gold:
    'bg-brass-500 hover:bg-brass-400 active:bg-brass-600 text-white font-bold shadow-glow border border-brass-600/20 focus-visible:ring-brass-400',
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
    'font-body font-semibold inline-flex items-center justify-center rounded-xl transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas touch-manipulation select-none cursor-pointer'

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
