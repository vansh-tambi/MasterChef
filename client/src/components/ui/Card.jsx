import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { rotatedBadgePop } from '../../utils/motionPresets'

export function Card({
  accent = false,
  badge = null,
  className = '',
  children,
  ...props
}) {
  const shouldReduceMotion = useReducedMotion()
  const accentStyle = accent
    ? 'border-l-4 border-l-ember-500'
    : ''

  return (
    <div
      className={`relative rounded-xl border-2 border-panel-border bg-surface text-ink shadow-[4px_4px_0px_0px_rgba(26,29,32,0.08)] dark:shadow-[4px_4px_0px_0px_#181B20] p-5 sm:p-8 transition-colors duration-200 ${accentStyle} ${className}`}
      {...props}
    >
      {/* Floating Overlapping Physical Stamp Detail (Animated if badge provided) */}
      {badge && (
        <motion.div
          variants={shouldReduceMotion ? undefined : rotatedBadgePop(-2)}
          initial={shouldReduceMotion ? false : "hidden"}
          animate="visible"
          className="pointer-events-none absolute -top-3 right-5 sm:right-7 border-2 border-panel-border bg-brass-400 text-ink text-[9px] sm:text-[10px] font-mono font-bold px-2.5 py-0.5 uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(26,29,32,0.3)] dark:shadow-[2px_2px_0px_0px_#000] select-none z-10"
          aria-hidden="true"
        >
          {badge}
        </motion.div>
      )}

      {/* Faint Oversized Vintage Culinary Watermark Emblem (2% opacity) */}
      <div
        className="pointer-events-none absolute -right-12 -bottom-12 w-64 h-64 opacity-[0.025] select-none text-ink overflow-hidden"
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
