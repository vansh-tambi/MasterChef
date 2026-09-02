import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const variants = {
  primary:
    'bg-ember-500 hover:bg-ember-600 active:bg-ember-600 text-white border-2 border-ember-700 shadow-[3px_3px_0px_0px_#8F2815] dark:shadow-[3px_3px_0px_0px_#000] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] focus-visible:ring-ember-400',
  secondary:
    'bg-rosemary-500 hover:bg-rosemary-600 active:bg-rosemary-600 text-white border-2 border-rosemary-700 shadow-[3px_3px_0px_0px_#1B3D2C] dark:shadow-[3px_3px_0px_0px_#000] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] focus-visible:ring-rosemary-400',
  outline:
    'border-2 border-panel-border bg-surface text-ink hover:border-ember-500 hover:text-ember-500 active:bg-elevated shadow-[2px_2px_0px_0px_rgba(26,29,32,0.12)] dark:shadow-[2px_2px_0px_0px_#2D323B] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] focus-visible:ring-ember-400',
  ghost:
    'border-2 border-transparent text-ink-secondary hover:border-panel-border hover:bg-elevated hover:text-ink active:translate-x-[1px] active:translate-y-[1px] focus-visible:ring-ember-400',
  gold:
    'bg-brass-500 hover:bg-brass-400 active:bg-brass-600 text-ink border-2 border-brass-600 shadow-[3px_3px_0px_0px_#8A601E] dark:shadow-[3px_3px_0px_0px_#000] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] focus-visible:ring-brass-400',
}

const sizes = {
  sm: 'min-h-[38px] px-3.5 py-1.5 text-xs',
  md: 'min-h-[44px] px-5 py-2.5 text-xs sm:text-sm',
  lg: 'min-h-[50px] px-6 py-3 text-sm sm:text-base',
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
    'font-mono uppercase tracking-wider font-bold inline-flex items-center justify-center rounded-md transition-all duration-100 disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas touch-manipulation select-none cursor-pointer'

  const variantStyles = variants[variant] || variants.primary
  const sizeStyles = sizes[size] || sizes.md

  return (
    <motion.button
      disabled={disabled}
      whileHover={disabled || shouldReduceMotion ? undefined : { scale: 1.01 }}
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default Button
