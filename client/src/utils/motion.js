/**
 * Shared Framer Motion Tokens & Orchestration Variants
 * Respects prefers-reduced-motion for complete accessibility.
 */

export const springTactile = {
  type: "spring",
  stiffness: 400,
  damping: 25,
};

export const springBounce = {
  type: "spring",
  stiffness: 500,
  damping: 15,
};

export const fadeTransition = {
  duration: 0.25,
  ease: [0.25, 0.1, 0.25, 1.0],
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 },
  },
};

export const platedItem = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 28,
    },
  },
};

export const swapExpand = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: "auto" },
  exit: { opacity: 0, height: 0 },
  transition: { duration: 0.22, ease: "easeInOut" },
};
