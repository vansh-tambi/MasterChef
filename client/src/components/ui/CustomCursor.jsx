import React, { useEffect, useRef, useState } from 'react'

/**
 * 60 FPS Hardware-Accelerated Custom Cursor (Artisanal Whisk Utensil)
 * Features:
 * - Touch & Coarse Pointer Suppression
 * - requestAnimationFrame LERP Engine
 * - Zero Layout Thrashing (direct transform manipulation)
 * - Interactive Hover Stirring & Click Dip Physics
 */
export function CustomCursor() {
  const cursorRef = useRef(null)
  const isHoveredRef = useRef(false)
  const isPressedRef = useRef(false)
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    // Touch / Coarse pointer suppression guard
    const isTouch =
      window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0

    if (isTouch) {
      return
    }

    setIsEnabled(true)
    document.documentElement.classList.add('cursor-none-active')

    let targetX = -100
    let targetY = -100
    let currentX = -100
    let currentY = -100
    let isVisible = false
    let animationFrameId

    const onMouseMove = (e) => {
      targetX = e.clientX
      targetY = e.clientY
      if (!isVisible) {
        isVisible = true
        currentX = targetX
        currentY = targetY
      }
    }

    const onMouseLeave = () => {
      isVisible = false
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '0'
      }
    }

    const onMouseEnter = () => {
      isVisible = true
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '1'
      }
    }

    const onPointerOver = (e) => {
      const interactiveEl = e.target.closest(
        'button, a, input, textarea, select, [role="button"], [role="checkbox"], label, .interactive-hover'
      )
      isHoveredRef.current = Boolean(interactiveEl)
    }

    const onPointerOut = () => {
      isHoveredRef.current = false
    }

    const onMouseDown = () => {
      isPressedRef.current = true
    }

    const onMouseUp = () => {
      isPressedRef.current = false
    }

    // 60 FPS LERP Render Loop
    const render = () => {
      // Linear interpolation factor (0.18 for smooth responsive tracking)
      currentX += (targetX - currentX) * 0.18
      currentY += (targetY - currentY) * 0.18

      if (cursorRef.current && isVisible) {
        let transformStr = `translate3d(${currentX}px, ${currentY}px, 0)`

        if (isPressedRef.current) {
          transformStr += ' scale(0.85) rotate(-12deg)'
        } else if (isHoveredRef.current) {
          transformStr += ' scale(1.18) rotate(18deg)'
        } else {
          transformStr += ' scale(1) rotate(0deg)'
        }

        cursorRef.current.style.transform = transformStr
        cursorRef.current.style.opacity = '1'
      }

      animationFrameId = requestAnimationFrame(render)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseleave', onMouseLeave, { passive: true })
    window.addEventListener('mouseenter', onMouseEnter, { passive: true })
    window.addEventListener('pointerover', onPointerOver, { passive: true })
    window.addEventListener('pointerout', onPointerOut, { passive: true })
    window.addEventListener('mousedown', onMouseDown, { passive: true })
    window.addEventListener('mouseup', onMouseUp, { passive: true })

    animationFrameId = requestAnimationFrame(render)

    return () => {
      document.documentElement.classList.remove('cursor-none-active')
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('mouseenter', onMouseEnter)
      window.removeEventListener('pointerover', onPointerOver)
      window.removeEventListener('pointerout', onPointerOut)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  if (!isEnabled) return null

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform opacity-0 -ml-1 -mt-1 select-none transition-opacity duration-150"
      style={{
        transform: 'translate3d(-100px, -100px, 0)',
        transformOrigin: '2px 2px',
      }}
      aria-hidden="true"
    >
      {/* Artisanal Kitchen Whisk SVG Icon */}
      <svg
        width="34"
        height="34"
        viewBox="0 0 34 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
      >
        {/* Pointer Hotspot Dot */}
        <circle cx="2" cy="2" r="2" fill="#D99B26" />

        {/* Whisk Handle (Terracotta) */}
        <line
          x1="2"
          y1="2"
          x2="12"
          y2="12"
          stroke="#C85A32"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Handle Collar (Mustard Gold) */}
        <circle cx="12" cy="12" r="2" fill="#D99B26" />

        {/* Whisk Balloon Loops (Sage / Gold Wire) */}
        <path
          d="M12 12 Q20 14 26 26 Q14 20 12 12 Z"
          fill="rgba(217, 155, 38, 0.15)"
          stroke="#D99B26"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 12 Q24 16 28 28 Q16 24 12 12 Z"
          stroke="#586B4D"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <path
          d="M12 12 Q16 24 24 30 Q20 18 12 12 Z"
          stroke="#D96E47"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

export default CustomCursor
