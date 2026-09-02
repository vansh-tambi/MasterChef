import React, { useEffect, useRef, useState } from 'react'

/**
 * 60 FPS Hardware-Accelerated Custom Cursor (Iconic Chef's Knife)
 * Features:
 * - Ultra-crisp, instantly recognizable Chef's Knife SVG (Option B)
 * - Gentle ~15° idle breathing/swaying rotation physics
 * - Interactive hover stirring & click chop dynamics
 * - Touch & Coarse pointer suppression
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
    let startTime = performance.now()

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

    // 60 FPS Render Loop
    const render = (now) => {
      currentX += (targetX - currentX) * 0.18
      currentY += (targetY - currentY) * 0.18

      if (cursorRef.current && isVisible) {
        // Idle gentle sway (~15° subtle oscillation over 2.4s)
        const elapsed = (now - startTime) / 1000
        const idleWobble = Math.sin(elapsed * 2.6) * 6

        let transformStr = `translate3d(${currentX}px, ${currentY}px, 0)`

        if (isPressedRef.current) {
          // Tactile chop click
          transformStr += ` scale(0.85) rotate(${idleWobble - 16}deg)`
        } else if (isHoveredRef.current) {
          // Interactive hover poise
          transformStr += ` scale(1.15) rotate(${idleWobble + 14}deg)`
        } else {
          // Natural resting idle with gentle sway
          transformStr += ` scale(1) rotate(${idleWobble}deg)`
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
      className="fixed top-0 left-0 pointer-events-none z-[9999] will-change-transform opacity-0 select-none transition-opacity duration-150"
      style={{
        transform: 'translate3d(-100px, -100px, 0)',
        transformOrigin: '2px 2px',
      }}
      aria-hidden="true"
    >
      {/* Nordic Chef's Knife — Ember tip, Brass bolster, clean steel blade */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
      >
        {/* Knife Tip Pointer Hotspot */}
        <circle cx="2.5" cy="2.5" r="1.5" fill="#D49A3D" />

        {/* Steel Blade */}
        <path
          d="M2.5 2.5 L14.5 14.5 C16 16 17 18 16 20 L12 20 C10 18 8 16 6 12 Z"
          fill="#E8EAED"
          stroke="#2D323B"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />

        {/* Blade Spine Highlight / Bevel */}
        <path
          d="M2.5 2.5 L14.5 14.5"
          stroke="#F1F3F5"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* Bolster / Guard (Brass Accent) */}
        <rect
          x="13.5"
          y="13.5"
          width="4"
          height="4"
          rx="1"
          transform="rotate(45 15.5 15.5)"
          fill="#D49A3D"
          stroke="#2D323B"
          strokeWidth="1"
        />

        {/* Ergonomic Handle (Ember) */}
        <path
          d="M16 16 L25 25 C26.5 26.5 28 26 29 25 C30 24 30.5 22.5 29 21 L20 12 Z"
          fill="#E05338"
          stroke="#2D323B"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />

        {/* Brass Handle Rivets */}
        <circle cx="21.5" cy="18.5" r="0.85" fill="#F1F3F5" />
        <circle cx="24.5" cy="21.5" r="0.85" fill="#F1F3F5" />
        <circle cx="27.5" cy="24.5" r="0.85" fill="#F1F3F5" />
      </svg>
    </div>
  )
}

export default CustomCursor
