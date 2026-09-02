/**
 * Centralized Framer Motion Presets & Physics Tokens for Master Chef
 * Designed for tactile, mechanical UI feedback and high-performance rendering.
 */

export const springTap = {
  type: "spring",
  stiffness: 700,
  damping: 35,
  mass: 0.5,
};

export const springPop = {
  type: "spring",
  stiffness: 450,
  damping: 28,
};

export const springBounce = {
  type: "spring",
  stiffness: 500,
  damping: 15,
};

export const smoothFade = {
  duration: 0.22,
  ease: [0.25, 0.1, 0.25, 1.0],
};

export const fadeTransition = {
  duration: 0.25,
  ease: [0.25, 0.1, 0.25, 1.0],
};

// Top-level container staging
export const staggerPlating = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.18 },
  },
};

// Child section entrance
export const platedSection = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springPop,
  },
};

// Staggered tag / badge entrance
export const tagStagger = {
  hidden: { opacity: 0, scale: 0.9, y: 6 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 500, damping: 25 },
  },
};

// Overlapping rotated badge flourish
export const rotatedBadgePop = (targetRotation = -2) => ({
  hidden: { opacity: 0, scale: 0.8, rotate: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: targetRotation,
    transition: { type: "spring", stiffness: 400, damping: 20, delay: 0.15 },
  },
});

export const swapExpand = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: "auto" },
  exit: { opacity: 0, height: 0 },
  transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1.0] },
};

// Aliases for compatibility
export const staggerContainer = staggerPlating;
export const platedItem = platedSection;
